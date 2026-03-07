import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Using EXPO_PUBLIC_ environment variables automatically injected by Expo Metro bundler
// Fallback to 10.0.2.2 for Android Emulator if the .env file is missing.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://10.0.2.2:3000/api/farmer';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // timeout: 10000, // Optional timeout
});

// Request Interceptor: Automatically attach the token to every outgoing request
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('userToken');
        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401/403 and attempt seamless JWT refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If response is unauthorized/forbidden and we haven't already retried this exact request
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = await AsyncStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error("No refresh token stored.");
                }

                // Call the auth/refresh endpoint directly using raw axios (avoid interceptor loop!)
                const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
                    refresh_token: refreshToken
                });

                if (response.status === 200) {
                    const { token, refreshToken: newRefreshToken } = response.data;

                    // Save the new keys to local storage
                    await AsyncStorage.setItem('userToken', token);
                    await AsyncStorage.setItem('refreshToken', newRefreshToken);
                    console.log("JWT Seamless Refresh successful!");

                    // Reconstruct the failed request's headers and fire it again
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                console.error('Seamless JWT Refresh failed. Forcing logout purge.', refreshError);
                await AsyncStorage.removeItem('userToken');
                await AsyncStorage.removeItem('refreshToken');
                await AsyncStorage.removeItem('authId');
            }
        }

        return Promise.reject(error);
    }
);
