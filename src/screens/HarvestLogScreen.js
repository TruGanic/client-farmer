import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const HarvestLogScreen = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cropVariety, setCropVariety] = useState('');
    const [yieldAmount, setYieldAmount] = useState('');
    const [destination, setDestination] = useState('');

    const destinations = ['Market', 'Exporter', 'Home'];

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSave = () => {
        const record = {
            type: 'Harvest Log',
            date: date.toISOString().split('T')[0],
            cropVariety,
            yieldAmount: `${yieldAmount} kg`,
            destination,
        };
        console.log('Saved Record:', JSON.stringify(record, null, 2));
        navigation.goBack();
    };

    // Custom Dropdown Component
    const Dropdown = ({ label, value, options, onSelect, helperText }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">{label}</Text>
                <TouchableOpacity
                    className="bg-white border border-green-200 rounded-xl p-4 flex-row justify-between items-center"
                    onPress={() => setIsOpen(!isOpen)}
                >
                    <Text className={value ? 'text-gray-800' : 'text-gray-400'}>
                        {value || `Select ${label}`}
                    </Text>
                    <ChevronDown size={20} color="#16a34a" />
                </TouchableOpacity>
                {helperText && (
                    <Text className="text-gray-500 text-xs ml-1 mt-1 italic">{helperText}</Text>
                )}
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
            <Text className="text-2xl font-bold text-green-800 mb-6">Log Harvest</Text>

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

            {/* Yield Amount */}
            <View className="mb-4">
                <Text className="text-green-800 font-medium mb-1 ml-1">Yield Amount (kg)</Text>
                <TextInput
                    className="bg-white border border-green-200 rounded-xl p-4 text-gray-800"
                    placeholder="e.g. 150"
                    keyboardType="numeric"
                    value={yieldAmount}
                    onChangeText={setYieldAmount}
                />
            </View>

            {/* Market Destination */}
            <Dropdown
                label="Market Destination"
                value={destination}
                options={destinations}
                onSelect={setDestination}
                helperText="If consumed by family, select Home"
            />

            <TouchableOpacity
                className="bg-green-700 p-4 rounded-xl items-center shadow-sm mb-10 mt-4"
                onPress={handleSave}
            >
                <Text className="text-white font-bold text-lg">Save Record</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default HarvestLogScreen;
