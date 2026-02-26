import axios from 'axios';

// Using 10.0.2.2 for Android Emulator. Use localhost for iOS simulator or your local IP (e.g., http://192.168.1.5:3000) for physical devices.
export const API_BASE_URL = 'http://10.0.2.2:3000/api/farmer';

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // timeout: 10000, // Optional timeout
});
