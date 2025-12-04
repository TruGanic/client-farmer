import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Sprout, Wheat, ClipboardList, Calendar } from 'lucide-react-native';

// Mock Data
const mockInputLogs = [
    { id: '1', date: '2023-10-01', category: 'Organic Fertilizer', productName: 'Compost', quantity: '50 kg', location: 'Plot A' },
    { id: '2', date: '2023-10-05', category: 'Chemical Fertilizer', productName: 'Urea', quantity: '10 kg', location: 'Plot B' },
    { id: '3', date: '2023-10-10', category: 'Pesticide', productName: 'Neem Oil', quantity: '2 L', location: 'Greenhouse 1' },
    { id: '4', date: '2023-10-15', category: 'Organic Fertilizer', productName: 'Manure', quantity: '100 kg', location: 'Plot C' },
    { id: '5', date: '2023-10-20', category: 'Chemical Fertilizer', productName: 'NPK 15-15-15', quantity: '25 kg', location: 'Plot A' },
];

const mockPlantingLogs = [
    { id: '1', date: '2023-09-01', cropVariety: 'Tomato - Roma', seedAmount: '500 seeds', areaCovered: '0.5 Acres' },
    { id: '2', date: '2023-09-05', cropVariety: 'Lettuce - Iceberg', seedAmount: '1000 seeds', areaCovered: '0.2 Acres' },
    { id: '3', date: '2023-09-10', cropVariety: 'Carrot - Nantes', seedAmount: '200 g', areaCovered: '0.3 Acres' },
    { id: '4', date: '2023-09-15', cropVariety: 'Spinach', seedAmount: '100 g', areaCovered: '0.1 Acres' },
    { id: '5', date: '2023-09-20', cropVariety: 'Pepper - Bell', seedAmount: '300 seedlings', areaCovered: '0.4 Acres' },
];

const mockHarvestLogs = [
    { id: '1', date: '2023-11-01', cropVariety: 'Tomato - Roma', yieldAmount: '150 kg', marketDestination: 'Market' },
    { id: '2', date: '2023-11-05', cropVariety: 'Lettuce - Iceberg', yieldAmount: '50 kg', marketDestination: 'Home' },
    { id: '3', date: '2023-11-10', cropVariety: 'Carrot - Nantes', yieldAmount: '80 kg', marketDestination: 'Exporter' },
    { id: '4', date: '2023-11-15', cropVariety: 'Spinach', yieldAmount: '20 kg', marketDestination: 'Market' },
    { id: '5', date: '2023-11-20', cropVariety: 'Pepper - Bell', yieldAmount: '60 kg', marketDestination: 'Market' },
];

const HistoryScreen = () => {
    const [activeTab, setActiveTab] = useState('Inputs');

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
        <View className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100">
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
            <View className="mt-3 flex-row justify-between border-t border-gray-100 pt-2">
                <Text className="text-gray-600">Yield: <Text className="font-bold">{item.yieldAmount}</Text></Text>
                <Text className="text-gray-600">Dest: <Text className="font-bold">{item.marketDestination}</Text></Text>
            </View>
        </View>
    );

    const getData = () => {
        switch (activeTab) {
            case 'Inputs': return mockInputLogs;
            case 'Planting': return mockPlantingLogs;
            case 'Harvest': return mockHarvestLogs;
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
            <FlatList
                data={getData()}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default HistoryScreen;
