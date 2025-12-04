import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Leaf } from 'lucide-react-native';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Login attempt:', email);
        // Navigate to Home on success (mock)
        navigation.replace('Home');
    };

    return (
        <View className="flex-1 bg-green-50 justify-center p-6">
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
        </View>
    );
};

export default LoginScreen;
