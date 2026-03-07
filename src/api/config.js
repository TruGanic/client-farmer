import AsyncStorage from "@react-native-async-storage/async-storage";
import { signedFarmerRequest } from "../auth/signedClient";

// Zero‑trust + JWT hybrid:
// - All calls go through signedFarmerRequest (DID + signature, via Gateway)
// - On 401/403, transparently try /auth/refresh using stored refreshToken
// - If refresh succeeds, tokens are updated and the original call is retried

export async function apiRequest(method, path, body) {
  let hasRetried = false;

  const doCall = async () => {
    // Attach JWT Authorization header if present (for farmer server)
    const token = await AsyncStorage.getItem("userToken");
    const extraHeaders = token
      ? { Authorization: `Bearer ${token}` }
      : undefined;

    // Main signed request (DID-based + optional JWT)
    const { status, data } = await signedFarmerRequest(
      method,
      path,
      body,
      extraHeaders
    );
    return { status, data };
  };

  try {
    return await doCall();
  } catch (error) {
    const response = error?.response;

    if (
      !response ||
      (response.status !== 401 && response.status !== 403) ||
      hasRetried
    ) {
      // Not an auth error, or already retried once → bubble up
      throw error;
    }

    hasRetried = true;

    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token stored.");
      }

      // Call auth/refresh through the same signed client
      const refreshResult = await signedFarmerRequest("POST", "/auth/refresh", {
        refresh_token: refreshToken,
      });

      if (refreshResult.status === 200) {
        const { token, refreshToken: newRefreshToken } = refreshResult.data;

        await AsyncStorage.setItem("userToken", token);
        await AsyncStorage.setItem("refreshToken", newRefreshToken);
        console.log("JWT Seamless Refresh successful (signed client).");

        // Retry the original signed call once
        return await doCall();
      }
    } catch (refreshError) {
      console.error(
        "Seamless JWT Refresh failed. Forcing logout purge.",
        refreshError
      );
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("authId");
    }

    throw error;
  }
}

// Axios-style client so screens can use apiClient.post(path, body) unchanged
function toAxiosResponse(status, data) {
  return { data, status, statusText: status === 200 ? "OK" : status === 201 ? "Created" : "" };
}

export const apiClient = {
  get: (path) => apiRequest("GET", path, undefined).then(({ status, data }) => toAxiosResponse(status, data)),
  post: (path, body) => apiRequest("POST", path, body).then(({ status, data }) => toAxiosResponse(status, data)),
  put: (path, body) => apiRequest("PUT", path, body).then(({ status, data }) => toAxiosResponse(status, data)),
  patch: (path, body) => apiRequest("PATCH", path, body).then(({ status, data }) => toAxiosResponse(status, data)),
  delete: (path) => apiRequest("DELETE", path, undefined).then(({ status, data }) => toAxiosResponse(status, data)),
};