import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Leaf } from 'lucide-react-native';
import { apiClient } from '../api/config';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        try {
            const response = await apiClient.post('/auth/login', { email, password });

            if (response.status === 200) {
                const { token, refreshToken, farmer } = response.data;

                // Securely store token, refresh token, authId, and username
                await AsyncStorage.setItem('userToken', token);
                if (refreshToken) {
                    await AsyncStorage.setItem('refreshToken', refreshToken);
                }
                await AsyncStorage.setItem('authId', farmer.authId);
                await AsyncStorage.setItem('userName', farmer.username || 'Farmer');

                console.log('Login successful! Auth ID stored:', farmer.authId);
                navigation.replace('Home');
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Invalid credentials or server error';
            Alert.alert('Login Failed', errorMsg);
            console.error('Login error:', error);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            className="bg-green-50"
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="items-center mb-10">
                        <View className="bg-green-100 p-4 rounded-full mb-4">
                            <Leaf color="#16a34a" size={48} />
                        </View>
                        <Text className="text-3xl font-bold text-green-800">Welcome Back</Text>
                        <Text className="text-green-600 mt-2">Sign in to continue farming</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-green-800 font-medium mb-1 ml-1">Email</Text>
                            <TextInput
                                className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                                placeholder="farmer@example.com"
                                placeholderTextColor="#9ca3af"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View>
                            <Text className="text-green-800 font-medium mb-1 ml-1">Password</Text>
                            <TextInput
                                className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                                placeholder="••••••••"
                                placeholderTextColor="#9ca3af"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity
                            className="bg-green-600 p-4 rounded-xl items-center mt-6 shadow-sm"
                            onPress={handleLogin}
                        >
                            <Text className="text-white font-bold text-lg">Login</Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-center mt-6">
                            <Text className="text-gray-600">Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('UserRegistration')}>
                                <Text className="text-green-600 font-bold">Register</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;
