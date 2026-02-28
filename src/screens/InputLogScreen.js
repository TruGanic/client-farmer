import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/config';

const InputLogScreen = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [category, setCategory] = useState('');
    const [productName, setProductName] = useState('');
    const [plot, setPlot] = useState('');
    const [quantity, setQuantity] = useState('');
    const [unit, setUnit] = useState('kg');

    const categories = ['Organic Fertilizer', 'Chemical Fertilizer', 'Pesticide'];
    const plots = ['Plot A', 'Plot B', 'Plot C', 'Greenhouse 1'];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSave = async () => {
        if (!category || !productName || !plot || !quantity) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');

            const payload = {
                zoneId: plot,
                date: date.toISOString(),
                inputCategory: category,
                productName,
                quantity: parseFloat(quantity),
                unit,
            };

            const response = await apiClient.post('/logs/input', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Input log created successfully!');
                navigation.goBack();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to create input log';
            Alert.alert('Error', errorMsg);
            console.error('Input log error:', error);
        }
    };

    // Custom Dropdown Component (simplified for demo)
    const Dropdown = ({ label, value, options, onSelect, highlighted }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <View className="mb-4">
                <Text className={`font-medium mb-1 ml-1 ${highlighted ? 'text-red-600 font-bold' : 'text-green-800'}`}>
                    {label} {highlighted && '*'}
                </Text>
                <TouchableOpacity
                    className={`bg-white border rounded-xl p-4 flex-row justify-between items-center ${highlighted ? 'border-red-300 bg-red-50' : 'border-green-200'}`}
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Text className={value ? 'text-gray-800' : 'text-gray-400'}>
                        {value || `Select ${label}`}
                    </Text>
                    <ChevronDown size={20} color={highlighted ? '#ef4444' : '#16a34a'} />
                </TouchableOpacity>
                {isOpen && (
                    <View className="bg-white border border-gray-100 rounded-xl mt-1 shadow-sm overflow-hidden">
                        {options.map((option) => (
                            <TouchableOpacity
                                key={option}
                                className="p-3 border-b border-gray-50 active:bg-green-50"
                                onPress={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                            >
                                <Text className="text-gray-700">{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <ScrollView className="flex-1 bg-green-50 p-6">
            <Text className="text-2xl font-bold text-green-800 mb-6">Log Input</Text>

            {/* Date Picker */}
            <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">Date</Text>
                <TouchableOpacity
                    className="bg-white border border-green-200 rounded-xl p-4 flex-row items-center"
                    onPress={() => setShowDatePicker(true)}
                >
                    <Calendar size={20} color="#16a34a" className="mr-3" />
                    <Text className="text-gray-800">{date.toLocaleDateString()}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}
            </View>

            {/* Input Category (Highlighted) */}
            <Dropdown
                label="Input Category"
                value={category}
                options={categories}
                onSelect={setCategory}
                highlighted={true}
            />

            {/* Product Name */}
            <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">Product Name</Text>
                <TextInput
                    className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                    placeholder="e.g. Urea, Compost"
                    value={productName}
                    onChangeText={setProductName}
                />
            </View>

            {/* Where Applied */}
            <Dropdown
                label="Where Applied"
                value={plot}
                options={plots}
                onSelect={setPlot}
            />

            {/* Quantity with Unit Toggle */}
            <View className="mb-6">
                <Text className="text-green-800 font-medium mb-1 ml-1">Quantity</Text>
                <View className="flex-row">
                    <TextInput
                        className="flex-1 bg-white border border-green-200 rounded-l-xl p-4 text-gray-800"
                        placeholder="0.00"
                        keyboardType="numeric"
                        value={quantity}
                        onChangeText={setQuantity}
                    />
                    <View className="flex-row bg-green-100 rounded-r-xl border-t border-b border-r border-green-200 overflow-hidden">
                        <TouchableOpacity
                            className={`px-4 justify-center ${unit === 'kg' ? 'bg-green-600' : 'bg-transparent'}`}
                            onPress={() => setUnit('kg')}
                        >
                            <Text className={`font-bold ${unit === 'kg' ? 'text-white' : 'text-green-800'}`}>kg</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`px-4 justify-center ${unit === 'L' ? 'bg-green-600' : 'bg-transparent'}`}
                            onPress={() => setUnit('L')}
                        >
                            <Text className={`font-bold ${unit === 'L' ? 'text-white' : 'text-green-800'}`}>L</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                className="bg-green-700 p-4 rounded-xl items-center shadow-sm mb-10"
                onPress={handleSave}
            >
                <Text className="text-white font-bold text-lg">Save Record</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default InputLogScreen;
