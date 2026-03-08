import * as Crypto from "expo-crypto";
import { Buffer } from "buffer";
import { ec as EC } from "elliptic";
import axios from "axios";

const ec = new EC("secp256k1");

const DEFAULT_GATEWAY_URL = "http://localhost:3000";
const DEFAULT_CLIENT_DID =
  "did:web:truganic.github.io:did-documents:clients:farmer-client";

export async function generateNonce() {
  const bytes = await Crypto.getRandomBytesAsync(16);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function createSignableMessage(
  method,
  path,
  timestamp,
  nonce,
  body,
  headers
) {
  const pathForPayload = path.startsWith("/") ? path : `/${path}`;

  const excludedHeaders = new Set([
    "x-signature",
    "x-plugin-did",
    "accept",
    "accept-encoding",
    "host",
    "connection",
    "user-agent",
    "content-length",
    "if-none-match",
    "if-modified-since",
    "if-match",
    "if-range",
  ]);

  const otherHeaders = {};
  if (headers) {
    for (const [key, value] of Object.entries(headers)) {
      const lowerKey = key.toLowerCase();
      if (!excludedHeaders.has(lowerKey)) {
        otherHeaders[lowerKey] = value;
      }
    }
  }

  // Canonical key order so payload string matches server (signature verification)
  const sortedHeaderKeys = Object.keys(otherHeaders).sort();
  const canonicalHeaders = {};
  for (const k of sortedHeaderKeys) {
    canonicalHeaders[k] = otherHeaders[k];
  }

  const normalizedBody =
    body !== undefined && body !== null ? body : {};

  const payload = {
    method: method,
    path: pathForPayload,
    timestamp: timestamp,
    nonce: nonce,
    body: normalizedBody,
    headers: canonicalHeaders,
  };

  return JSON.stringify(payload);
}

export async function signMessage(message, privateKeyHex) {
  const keyPair = ec.keyFromPrivate(privateKeyHex, "hex");
  const hashHex = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    message
  );
  const msgHash = Buffer.from(hashHex, "hex");
  const signature = keyPair.sign(msgHash);
  const r = signature.r.toArray("be", 32);
  const s = signature.s.toArray("be", 32);
  const signatureBuffer = Buffer.concat([Buffer.from(r), Buffer.from(s)]);
  return signatureBuffer.toString("base64");
}

export async function generateAuthHeaders(config) {
  const {
    method,
    path,
    body,
    clientDid,
    privateKey,
    timestamp: providedTimestamp,
    nonce: providedNonce,
    additionalHeaders = {},
  } = config;

  const timestamp = providedTimestamp || new Date().toISOString();
  const nonce = providedNonce || (await generateNonce());

  // Only include content-type in signed payload when request has a body, so GET (no body)
  // matches server payload (server often doesn't receive Content-Type for GET)
  const hasBody =
    body !== undefined &&
    body !== null &&
    (typeof body !== "object" || Object.keys(body).length > 0);
  const requestHeaders = {
    ...(hasBody ? { "content-type": "application/json" } : {}),
    "x-timestamp": timestamp,
    "x-nonce": nonce,
    ...additionalHeaders,
  };

  console.log("[client] Signature input (pre-payload)", {
    method,
    rawPath: path,
    normalizedPath: path.startsWith("/") ? path : `/${path}`,
    timestamp,
    nonce,
    body,
    headers: requestHeaders,
  });

  const message = createSignableMessage(
    method,
    path,
    timestamp,
    nonce,
    body,
    requestHeaders
  );

  const signature = await signMessage(message, privateKey);

  const payloadSha256Hex = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    message
  );
  const pathInPayload = path.startsWith("/") ? path : `/${path}`;
  console.log("[client] Signed payload (post-payload)", {
    pathInPayload,
    method,
    timestamp,
    nonce,
    payloadJson: message,
    payloadSha256Hex,
    signatureLength: signature.length,
    signaturePreview: `${signature.slice(0, 20)}...${signature.slice(-10)}`,
  });

  const headers = {
    ...(hasBody ? { "content-type": "application/json" } : {}),
    "x-plugin-did": clientDid,
    "x-signature": signature,
    "x-timestamp": timestamp,
    "x-nonce": nonce,
    ...additionalHeaders,
  };

  return {
    headers,
    message,
    signature,
    timestamp,
    nonce,
  };
}

// Expo only exposes EXPO_PUBLIC_* vars to the bundle. We must access them statically.
export async function signedRequest(method, path, body, additionalHeaders) {
  const gatewayUrl =
    process.env.EXPO_PUBLIC_GATEWAY_URL || process.env.GATEWAY_URL || DEFAULT_GATEWAY_URL;
  const clientDid =
    process.env.EXPO_PUBLIC_CLIENT_DID || process.env.CLIENT_DID || DEFAULT_CLIENT_DID;
  const privateKey = process.env.EXPO_PUBLIC_CLIENT_PRIVATE_KEY || process.env.CLIENT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "CLIENT_PRIVATE_KEY required. Set in .env with EXPO_PUBLIC_CLIENT_PRIVATE_KEY (hex, no 0x). VC for this DID must include the required scope (e.g. write:farmer)."
    );
  }

  const config = {
    method,
    path,
    body,
    clientDid,
    privateKey,
    gatewayUrl,
    additionalHeaders,
  };

  const { headers } = await generateAuthHeaders(config);
  const url = `${gatewayUrl}${path}`;
  const r = await axios({
    method,
    url,
    data: body,
    headers: {
      ...headers,
      ...(body !== undefined && body !== null
        ? { "Content-Type": "application/json" }
        : {}),
    },
  });
  return { data: r.data, status: r.status };
}

function buildFarmerPath(path) {
  if (path.startsWith("/api/farmer")) {
    return path;
  }
  const withoutLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return `/api/farmer${withoutLeadingSlash}`;
}

export async function signedFarmerRequest(method, path, body, additionalHeaders) {
  const fullPath = buildFarmerPath(path);
  return signedRequest(method, fullPath, body, additionalHeaders);
}
