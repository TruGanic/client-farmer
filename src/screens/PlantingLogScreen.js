import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, ChevronDown, QrCode } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '../api/config';

const PlantingLogScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [cropVariety, setCropVariety] = useState('');
    const [plot, setPlot] = useState('');
    const [amount, setAmount] = useState('');
    const [area, setArea] = useState('');
    const [sensorId, setSensorId] = useState('');
    const [isScanned, setIsScanned] = useState(false); // New flag to track scan origin

    const plots = ['Plot A', 'Plot B', 'Plot C', 'Greenhouse 1'];

    // Listen for QR Scan results passed back from QRScannerScreen
    React.useEffect(() => {
        if (route.params?.scannedSensorId) {
            setSensorId(route.params.scannedSensorId);
            setIsScanned(true); // Lock the input because it came from a secure scan
        }
    }, [route.params?.scannedSensorId]);

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleScanQR = () => {
        navigation.navigate('QRScanner');
    };

    const handleSave = async () => {
        if (!plot || !cropVariety || !amount || !area || !sensorId) {
            Alert.alert('Validation Error', 'Please fill in all required fields including Sensor ID.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');

            const payload = {
                zoneId: plot, // 'Plot A', 'Plot B', etc
                date: date.toISOString(), // Send full ISO string
                cropVariety,
                seedQuantity: parseInt(amount, 10),
                areaCovered: parseFloat(area),
                sensorId
            };

            const response = await apiClient.post('/logs/planting', payload, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.status === 201) {
                Alert.alert('Success', 'Planting log created successfully!');
                navigation.goBack();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to create planting log';
            Alert.alert('Error', errorMsg);
            console.error('Planting log error:', error);
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
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            className="bg-green-50"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, padding: 24, paddingBottom: 40 }}
                keyboardShouldPersistTaps="handled"
            >
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

                {/* IoT Device Pairing */}
                <View className="bg-white p-4 rounded-xl border border-green-200 mb-6">
                    <Text className="text-green-800 font-bold text-lg mb-3">IoT Device Pairing</Text>
                    <Text className="text-gray-500 text-sm mb-4">Link your soil sensor to start monitoring this batch.</Text>

                    <TouchableOpacity
                        className="bg-green-100 border border-green-300 border-dashed p-4 rounded-xl items-center mb-4"
                        onPress={handleScanQR}
                    >
                        <QrCode color="#16a34a" size={32} />
                        <Text className="text-green-700 font-bold mt-2">Scan Sensor QR Code</Text>
                    </TouchableOpacity>

                    <Text className="text-center text-gray-400 mb-2">- OR -</Text>

                    <View>
                        <Text className="text-green-700 font-medium mb-1 ml-1">Enter Sensor ID Manually</Text>
                        <TextInput
                            className={`bg-gray-50 border border-green-100 rounded-xl p-4 text-gray-800 ${isScanned ? 'opacity-70 bg-gray-200' : ''}`}
                            placeholder="e.g. SN-12345678"
                            value={sensorId}
                            onChangeText={(text) => {
                                setSensorId(text);
                                setIsScanned(false); // If they start typing manually, ensure it's unlocked
                            }}
                            editable={!isScanned} // Only disable if the current ID was populated via QR Camera
                        />
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-green-700 p-4 rounded-xl items-center shadow-sm mb-10"
                    onPress={handleSave}
                >
                    <Text className="text-white font-bold text-lg">Save Record</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default PlantingLogScreen;
