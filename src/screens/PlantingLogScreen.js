import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const PlantingLogScreen = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cropVariety, setCropVariety] = useState('');
    const [amount, setAmount] = useState('');
    const [area, setArea] = useState('');

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSave = () => {
        const record = {
            type: 'Planting Log',
            date: date.toISOString().split('T')[0],
            cropVariety,
            amount,
            area: `${area} Acres`,
        };
        console.log('Saved Record:', JSON.stringify(record, null, 2));
        navigation.goBack();
    };

    return (
        <ScrollView className="flex-1 bg-green-50 p-6">
            <Text className="text-2xl font-bold text-green-800 mb-6">Log Planting</Text>

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

            {/* Crop Variety */}
            <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">Crop Variety</Text>
                <TextInput
                    className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                    placeholder="e.g. Tomato - Roma"
                    value={cropVariety}
                    onChangeText={setCropVariety}
                />
            </View>

            {/* Amount */}
            <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">Amount (Seeds/Seedlings)</Text>
                <TextInput
                    className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                    placeholder="e.g. 500 seedlings"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            {/* Area Covered */}
            <View className="mb-6">
                <Text className="text-green-800 font-medium mb-1 ml-1">Area Covered (Acres)</Text>
                <TextInput
                    className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                    placeholder="e.g. 0.5"
                    keyboardType="numeric"
                    value={area}
                    onChangeText={setArea}
                />
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

export default PlantingLogScreen;
