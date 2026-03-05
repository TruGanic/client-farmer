import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';
import { Sprout, Wheat, ClipboardList, Calendar, Truck } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/config';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = () => {
    const [activeTab, setActiveTab] = useState('Inputs');
    const [inputs, setInputs] = useState([]);
    const [plantings, setPlantings] = useState([]);
    const [harvests, setHarvests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedHarvest, setSelectedHarvest] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await apiClient.get('/logs/history', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { plantings: fetchedPlantings, inputs: fetchedInputs, harvests: fetchedHarvests } = response.data;
            setPlantings(fetchedPlantings || []);
            setInputs(fetchedInputs || []);
            setHarvests(fetchedHarvests || []);
        } catch (error) {
            console.error('Error fetching history:', error);
            Alert.alert('Error', 'Failed to load history data');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchHistory();
        }, [])
    );

    const handleTransport = async () => {
        if (!selectedHarvest) return;
        try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await apiClient.patch(`/logs/harvest/${selectedHarvest.id}/transport`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                // Blockchain Webhook Integration
                try {
                    const blockchainPayload = {
                        batchId: selectedHarvest.batchId,
                        farmerId: selectedHarvest.farmerId,
                        organicLevel: selectedHarvest.organicLevel ? selectedHarvest.organicLevel.toString() : "0",
                        plantedDate: selectedHarvest.plantedDate,
                        harvestedDate: selectedHarvest.harvestedDate
                    };

                    const blockchainUrl = process.env.EXPO_PUBLIC_BLOCKCHAIN_URL || 'http://35.198.229.152:3000/api/farmer/harvest';

                    await fetch(blockchainUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(blockchainPayload)
                    });
                    console.log("Blockchain sync successful:", blockchainPayload);
                } catch (bcError) {
                    console.error('Error sending data to blockchain:', bcError);
                    // Proceeding to update UI visually regardless of blockchain failure 
                }

                // Update local state to immediately show visual feedback
                setHarvests(prevHarvests =>
                    prevHarvests.map(h =>
                        h.id === selectedHarvest.id ? { ...h, status: 'Transported' } : h
                    )
                );
                Alert.alert('Success', 'Harvest marked as transported');
                setModalVisible(false);
            }
        } catch (error) {
            console.error('Error updating transport status:', error);
            Alert.alert('Error', 'Failed to update status');
        }
    };

    const renderTabButton = (tabName) => (
        <TouchableOpacity
            className={`flex-1 py-3 items-center border-b-2 ${activeTab === tabName ? 'border-green-600' : 'border-transparent'}`}
            onPress={() => setActiveTab(tabName)}
        >
            <Text className={`font-bold ${activeTab === tabName ? 'text-green-800' : 'text-gray-500'}`}>
                {tabName}
            </Text>
        </TouchableOpacity>
    );

    const renderInputItem = ({ item }) => {
        const isChemical = item.category === 'Chemical Fertilizer';
        const borderColor = isChemical ? 'border-red-200' : 'border-green-200';
        const bgColor = isChemical ? 'bg-red-50' : 'bg-green-50';

        return (
            <View className={`bg-white rounded-xl p-4 mb-3 shadow-sm border ${borderColor}`}>
                <View className="flex-row justify-between items-start">
                    <View className="flex-row items-center">
                        <View className={`p-2 rounded-full mr-3 ${bgColor}`}>
                            <ClipboardList size={20} color={isChemical ? '#ef4444' : '#16a34a'} />
                        </View>
                        <View>
                            <Text className="font-bold text-gray-800 text-lg">{item.productName}</Text>
                            <Text className="text-gray-500 text-sm">{item.category}</Text>
                        </View>
                    </View>
                    <Text className="text-gray-400 text-xs">{item.date}</Text>
                </View>
                <View className="mt-3 flex-row justify-between border-t border-gray-100 pt-2">
                    <Text className="text-gray-600">Qty: <Text className="font-bold">{item.quantity}</Text></Text>
                    <Text className="text-gray-600">Loc: <Text className="font-bold">{item.location}</Text></Text>
                </View>
            </View>
        );
    };

    const renderPlantingItem = ({ item }) => (
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
            <View className="flex-row justify-between items-start">
                <View className="flex-row items-center">
                    <View className="bg-green-100 p-2 rounded-full mr-3">
                        <Sprout size={20} color="#16a34a" />
                    </View>
                    <View>
                        <Text className="font-bold text-gray-800 text-lg">{item.cropVariety}</Text>
                        <Text className="text-gray-500 text-sm">Planting</Text>
                    </View>
                </View>
                <Text className="text-gray-400 text-xs">{item.date}</Text>
            </View>
            <View className="mt-3 flex-row justify-between border-t border-gray-100 pt-2">
                <Text className="text-gray-600">Amt: <Text className="font-bold">{item.seedAmount}</Text></Text>
                <Text className="text-gray-600">Area: <Text className="font-bold">{item.areaCovered}</Text></Text>
            </View>
        </View>
    );

    const renderHarvestItem = ({ item }) => (
        <TouchableOpacity
            className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
            onPress={() => {
                setSelectedHarvest(item);
                setModalVisible(true);
            }}
        >
            <View className="flex-row justify-between items-start">
                <View className="flex-row items-center">
                    <View className="bg-orange-100 p-2 rounded-full mr-3">
                        <Wheat size={20} color="#ea580c" />
                    </View>
                    <View>
                        <Text className="font-bold text-gray-800 text-lg">{item.cropVariety}</Text>
                        <Text className="text-gray-500 text-sm">Harvest</Text>
                    </View>
                </View>
                <Text className="text-gray-400 text-xs">{item.date}</Text>
            </View>
            <View className="mt-3 flex-row justify-between border-t border-gray-100 pt-2 items-center">
                <View>
                    <Text className="text-gray-600">Yield: <Text className="font-bold">{item.yieldAmount}</Text></Text>
                    <Text className="text-gray-600">Dest: <Text className="font-bold">{item.marketDestination}</Text></Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${item.status === 'Transported' ? 'bg-blue-100' : 'bg-orange-100'}`}>
                    <Text className={`text-xs font-bold ${item.status === 'Transported' ? 'text-blue-800' : 'text-orange-800'}`}>
                        {item.status}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const getData = () => {
        switch (activeTab) {
            case 'Inputs': return inputs;
            case 'Planting': return plantings;
            case 'Harvest': return harvests;
            default: return [];
        }
    };

    const renderItem = ({ item }) => {
        switch (activeTab) {
            case 'Inputs': return renderInputItem({ item });
            case 'Planting': return renderPlantingItem({ item });
            case 'Harvest': return renderHarvestItem({ item });
            default: return null;
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            {/* Tabs */}
            <View className="flex-row bg-white shadow-sm mb-2">
                {renderTabButton('Inputs')}
                {renderTabButton('Planting')}
                {renderTabButton('Harvest')}
            </View>

            {/* List */}
            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#16a34a" />
                </View>
            ) : (
                <FlatList
                    data={getData()}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View className="items-center mt-10">
                            <Calendar size={48} color="#9ca3af" className="mb-4" />
                            <Text className="text-gray-500 font-medium text-lg">No records found</Text>
                            <Text className="text-gray-400 text-center mt-2 px-6">
                                Start tracking your farm activity by creating a new log entry.
                            </Text>
                        </View>
                    }
                />
            )}

            {/* Harvest Details Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/50">
                    <View className="bg-white rounded-3xl w-5/6 p-6 shadow-xl">
                        {selectedHarvest && (
                            <>
                                <View className="flex-row items-center mb-6 border-b border-gray-100 pb-4">
                                    <View className="bg-orange-100 p-3 rounded-full mr-4">
                                        <Truck size={24} color="#ea580c" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-xl font-bold text-gray-800">Harvest Details</Text>
                                        <Text className="text-gray-500 text-sm">{selectedHarvest.cropVariety}</Text>
                                    </View>
                                </View>

                                <View className="bg-orange-50/50 p-4 rounded-2xl mb-6 border border-orange-100">
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-gray-500 font-medium">Batch ID</Text>
                                        <Text className="font-bold text-gray-800 text-xs bg-white px-2 py-1 rounded-md border border-gray-200">
                                            {selectedHarvest.batchId}
                                        </Text>
                                    </View>
                                    {(selectedHarvest.organicLevel !== undefined && selectedHarvest.organicLevel !== 'N/A') && (
                                        <View className="flex-row justify-between items-center mb-3">
                                            <Text className="text-gray-500 font-medium">Organic Level</Text>
                                            <View className="bg-green-100 px-2 py-1 rounded-md border border-green-200">
                                                <Text className="font-bold text-green-800 text-xs">{selectedHarvest.organicLevel}%</Text>
                                            </View>
                                        </View>
                                    )}
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-gray-500 font-medium">Yield Output</Text>
                                        <Text className="font-bold text-gray-800">{selectedHarvest.yieldAmount}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center mb-3">
                                        <Text className="text-gray-500 font-medium">Destination</Text>
                                        <Text className="font-bold text-gray-800">{selectedHarvest.marketDestination}</Text>
                                    </View>
                                    <View className="flex-row justify-between items-center border-t border-orange-200/50 pt-3 mt-1">
                                        <Text className="text-gray-500 font-medium">Current Status</Text>
                                        <Text className={`font-bold ${selectedHarvest.status === 'Transported' ? 'text-blue-600' : 'text-orange-600'}`}>
                                            {selectedHarvest.status}
                                        </Text>
                                    </View>
                                </View>

                                {selectedHarvest.status !== 'Transported' ? (
                                    <View className="flex-row space-x-3">
                                        <TouchableOpacity
                                            className="flex-1 bg-gray-100 py-4 rounded-xl items-center"
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text className="text-gray-600 font-bold text-base">Close</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            className="flex-[1.5] bg-orange-500 py-4 rounded-xl items-center shadow-sm"
                                            onPress={handleTransport}
                                        >
                                            <Text className="text-white font-bold text-base">Mark Transported</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        className="w-full bg-gray-100 py-4 rounded-xl items-center"
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text className="text-gray-600 font-bold text-base">Close window</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default HistoryScreen;
