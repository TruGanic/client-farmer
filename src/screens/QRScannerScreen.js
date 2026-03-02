import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { X, CornerUpLeft } from 'lucide-react-native';

const QRScannerScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        // Add minimal validation if you want, e.g. checking length or prefix
        if (data) {
            navigation.navigate('PlantingLog', { scannedSensorId: data });
        } else {
            Alert.alert('Error', 'Failed to read QR Code properly. Try again.');
            setScanned(false);
        }
    };

    if (hasPermission === null) {
        return <Text className="p-10 text-center">Requesting camera permission...</Text>;
    }
    if (hasPermission === false) {
        return <Text className="p-10 text-center text-red-600">No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <View className="bg-green-800 p-6 pt-12 flex-row justify-between items-center z-10">
                <Text className="text-white font-bold text-xl">Scan Sensor</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
                    <X color="white" size={28} />
                </TouchableOpacity>
            </View>

            <CameraView
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{
                    barcodeTypes: ["qr"],
                }}
                style={StyleSheet.absoluteFillObject}
            />

            <View className="absolute bottom-10 w-full items-center">
                <View className="bg-black/60 p-4 rounded-xl">
                    <Text className="text-white text-center mb-2">Point camera at the Sensor's QR Code</Text>
                    {scanned && (
                        <TouchableOpacity
                            className="bg-green-600 p-3 rounded-lg flex-row items-center justify-center"
                            onPress={() => setScanned(false)}
                        >
                            <CornerUpLeft color="white" size={18} className="mr-2" />
                            <Text className="text-white font-bold">Tap to Scan Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
});

export default QRScannerScreen;
