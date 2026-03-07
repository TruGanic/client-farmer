import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MapPin, Sprout } from 'lucide-react-native';
import * as Location from 'expo-location';
import { apiClient } from '../api/config';

const FarmRegistrationScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const userDetails = route.params?.userDetails || {};
    const [farmName, setFarmName] = useState('');
    const [totalArea, setTotalArea] = useState('');
    const [location, setLocation] = useState(null);

    const handleGetLocation = async () => {
        try {
            console.log('Requesting location permissions...');
            setLocation('Fetching location...');

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'We need access to your location to register the farm.');
                setLocation('');
                return;
            }

            console.log('Fetching GPS coordinates...');
            let currentLocation = await Location.getCurrentPositionAsync({});

            console.log('Reverse geocoding coordinates...');
            let geocode = await Location.reverseGeocodeAsync({
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude
            });

            if (geocode && geocode.length > 0) {
                const address = geocode[0];
                // E.g., "Colombo, Western Province"
                const readableLocation = [address.city || address.subregion, address.region]
                    .filter(Boolean)
                    .join(', ');

                setLocation(readableLocation || `Lat: ${currentLocation.coords.latitude.toFixed(4)}, Lon: ${currentLocation.coords.longitude.toFixed(4)}`);
            } else {
                // Fallback to raw coords if reverse geocoding fails
                setLocation(`Lat: ${currentLocation.coords.latitude.toFixed(4)}, Lon: ${currentLocation.coords.longitude.toFixed(4)}`);
            }
        } catch (error) {
            console.error("Error getting location:", error);
            Alert.alert('Location Error', 'Failed to fetch location. Please ensure your GPS is turned on.');
            setLocation('');
        }
    };

    const handleRegister = async () => {
        try {
            const payload = {
                ...userDetails,
                farmName,
                totalArea,
                location
            };

            const response = await apiClient.post('/auth/register', payload);

            if (response.status === 201) {
                Alert.alert('Success', 'Registration Complete! Please login.');
                navigation.navigate('Login');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Unknown error occurred';
            Alert.alert('Registration Failed', errorMsg);
            console.error('Registration error:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            className="bg-green-50"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="items-center mb-8 mt-4">
                    <View className="bg-green-100 p-3 rounded-full mb-3">
                        <Sprout color="#16a34a" size={32} />
                    </View>
                    <Text className="text-2xl font-bold text-green-800">Register New Farm</Text>
                    <Text className="text-green-600 mt-1">Step 2 of 2: Farm Details</Text>
                </View>

                <View className="space-y-5">
                    {/* Farm Details */}
                    <View>
                        <Text className="text-green-800 font-bold text-lg mb-3">Farm Details</Text>

                        <View className="mb-4">
                            <Text className="text-green-700 font-medium mb-1 ml-1">Farm Name</Text>
                            <TextInput
                                className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                                placeholder="e.g. Green Valley Farm"
                                value={farmName}
                                onChangeText={setFarmName}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-green-700 font-medium mb-1 ml-1">Total Area (Acres)</Text>
                            <TextInput
                                className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                                placeholder="e.g. 5.5"
                                keyboardType="numeric"
                                value={totalArea}
                                onChangeText={setTotalArea}
                            />
                        </View>

                        <View className="mb-4">
                            <Text className="text-green-700 font-medium mb-1 ml-1">Location</Text>
                            <View className="flex-row items-center">
                                <TextInput
                                    className="flex-1 bg-white border border-green-200 rounded-l-xl p-4 text-gray-800"
                                    placeholder="GPS Coordinates"
                                    value={location || ''}
                                    editable={false}
                                />
                                <TouchableOpacity
                                    className="bg-green-600 p-4 rounded-r-xl"
                                    onPress={handleGetLocation}
                                >
                                    <MapPin color="white" size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-green-700 p-4 rounded-xl items-center mt-4 mb-8 shadow-sm"
                        onPress={handleRegister}
                    >
                        <Text className="text-white font-bold text-lg">Complete Registration</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default FarmRegistrationScreen;
