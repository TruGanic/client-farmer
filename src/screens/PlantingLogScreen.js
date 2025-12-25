import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronDown } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const PlantingLogScreen = () => {
    const navigation = useNavigation();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cropVariety, setCropVariety] = useState('');
    const [plot, setPlot] = useState('');
    const [amount, setAmount] = useState('');
    const [area, setArea] = useState('');

    const plots = ['Plot A', 'Plot B', 'Plot C', 'Greenhouse 1'];

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
            plot,
            amount,
            area: `${area} Acres`,
        };
        console.log('Saved Record:', JSON.stringify(record, null, 2));
        navigation.goBack();
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



            {/* Where Planted */}
            <Dropdown
                label="Where Planted"
                value={plot}
                options={plots}
                onSelect={setPlot}
            />

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
        </ScrollView >
    );
};

export default PlantingLogScreen;
