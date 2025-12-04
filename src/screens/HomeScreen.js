import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ClipboardList, Sprout, Wheat, CheckCircle, Clock, LogOut } from 'lucide-react-native';

const HomeScreen = () => {
    const navigation = useNavigation();

    // Mock Data for Recent Activity
    const recentActivity = [
        { id: 1, action: 'Applied Compost', time: '2 days ago', icon: <Sprout size={20} color="#16a34a" /> },
        { id: 2, action: 'Watering - Sector A', time: '3 days ago', icon: <Clock size={20} color="#3b82f6" /> },
        { id: 3, action: 'Harvested Tomatoes', time: '1 week ago', icon: <Wheat size={20} color="#f97316" /> },
    ];

    return (
        <ScrollView className="flex-1 bg-gray-50 p-6">
            {/* Header */}
            <View className="mb-6 mt-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-gray-500 text-lg">Good Morning,</Text>
                    <Text className="text-3xl font-bold text-gray-800">Farmer Silva</Text>
                </View>
                <TouchableOpacity
                    className="bg-red-50 p-3 rounded-full"
                    onPress={() => navigation.replace('Login')}
                >
                    <LogOut color="#ef4444" size={24} />
                </TouchableOpacity>
            </View>

            {/* Compliance Badge */}
            <View className="bg-green-100 border border-green-200 p-4 rounded-2xl flex-row items-center mb-8 shadow-sm">
                <View className="bg-green-500 p-2 rounded-full mr-4">
                    <CheckCircle color="white" size={24} />
                </View>
                <View>
                    <Text className="text-green-800 font-bold text-lg">Organic Status: Verified</Text>
                    <Text className="text-green-600 text-sm">Valid until Dec 2025</Text>
                </View>
            </View>

            {/* Quick Actions Grid */}
            <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
            <View className="mb-8">
                <TouchableOpacity
                    className="bg-white p-4 rounded-xl w-full mb-3 shadow-sm flex-row items-center border border-gray-100"
                    onPress={() => console.log('Navigate to Input Log')} // Placeholder navigation
                >
                    <View className="bg-blue-100 p-3 rounded-full mr-4">
                        <ClipboardList color="#2563eb" size={24} />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">Log Input</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white p-4 rounded-xl w-full mb-3 shadow-sm flex-row items-center border border-gray-100"
                    onPress={() => console.log('Navigate to Planting Log')} // Placeholder navigation
                >
                    <View className="bg-green-100 p-3 rounded-full mr-4">
                        <Sprout color="#16a34a" size={24} />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">Log Planting</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="bg-white p-4 rounded-xl w-full shadow-sm flex-row items-center border border-gray-100"
                    onPress={() => console.log('Navigate to Harvest Log')} // Placeholder navigation
                >
                    <View className="bg-orange-100 p-3 rounded-full mr-4">
                        <Wheat color="#ea580c" size={24} />
                    </View>
                    <Text className="text-gray-800 font-bold text-lg">Log Harvest</Text>
                </TouchableOpacity>
            </View>

            {/* Recent Activity Widget */}
            <Text className="text-xl font-bold text-gray-800 mb-4">Recent Activity</Text>
            <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-8">
                {recentActivity.map((item, index) => (
                    <View key={item.id} className={`flex-row items-center py-3 ${index !== recentActivity.length - 1 ? 'border-b border-gray-100' : ''}`}>
                        <View className="bg-gray-50 p-2 rounded-full mr-3">
                            {item.icon}
                        </View>
                        <View className="flex-1">
                            <Text className="text-gray-800 font-medium">{item.action}</Text>
                            <Text className="text-gray-500 text-xs">{item.time}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
