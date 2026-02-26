import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { UserPlus } from 'lucide-react-native';

const UserRegistrationScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleContinue = () => {
        if (!username || !contactNo || !email || !password || password !== confirmPassword) {
            alert("Please fill all fields and ensure passwords match.");
            return;
        }
        navigation.navigate('FarmRegistration', {
            userDetails: { username, contactNo, email, password }
        });
    };

    return (
        <ScrollView className="flex-1 bg-green-50 p-6">
            <View className="items-center mb-8 mt-4">
                <View className="bg-green-100 p-3 rounded-full mb-3">
                    <UserPlus color="#16a34a" size={32} />
                </View>
                <Text className="text-2xl font-bold text-green-800">Create Account</Text>
                <Text className="text-green-600 mt-1">Step 1 of 2: User Details</Text>
            </View>

            <View className="space-y-4">
                <View>
                    <Text className="text-green-800 font-medium mb-1 ml-1">Username</Text>
                    <TextInput
                        className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                        placeholder="johndoe"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View>
                    <Text className="text-green-800 font-medium mb-1 ml-1">Contact No</Text>
                    <TextInput
                        className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                        placeholder="+1 234 567 8900"
                        keyboardType="phone-pad"
                        value={contactNo}
                        onChangeText={setContactNo}
                    />
                </View>

                <View>
                    <Text className="text-green-800 font-medium mb-1 ml-1">Email</Text>
                    <TextInput
                        className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                        placeholder="farmer@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View>
                    <Text className="text-green-800 font-medium mb-1 ml-1">Password</Text>
                    <TextInput
                        className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                        placeholder="••••••••"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <View>
                    <Text className="text-green-800 font-medium mb-1 ml-1">Confirm Password</Text>
                    <TextInput
                        className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                        placeholder="••••••••"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                    />
                </View>

                <TouchableOpacity
                    className="bg-green-600 p-4 rounded-xl items-center mt-6 shadow-sm"
                    onPress={handleContinue}
                >
                    <Text className="text-white font-bold text-lg">Continue</Text>
                </TouchableOpacity>

                <View className="flex-row justify-center mt-6 mb-8">
                    <Text className="text-gray-600">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-green-600 font-bold">Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default UserRegistrationScreen;
