import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import UserRegistrationScreen from '../screens/UserRegistrationScreen';
import FarmRegistrationScreen from '../screens/FarmRegistrationScreen';
import InputLogScreen from '../screens/InputLogScreen';
import PlantingLogScreen from '../screens/PlantingLogScreen';
import HarvestLogScreen from '../screens/HarvestLogScreen';
import HistoryScreen from '../screens/HistoryScreen';
import QRScannerScreen from '../screens/QRScannerScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UserRegistration"
                component={UserRegistrationScreen}
                options={{ title: 'Create Account', headerStyle: { backgroundColor: '#f0fdf4' } }}
            />
            <Stack.Screen
                name="FarmRegistration"
                component={FarmRegistrationScreen}
                options={{ title: 'Register Farm', headerStyle: { backgroundColor: '#f0fdf4' } }}
            />
            <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: 'Dashboard' }}
            />
            <Stack.Screen
                name="InputLog"
                component={InputLogScreen}
                options={{ title: 'Log Inputs' }}
            />
            <Stack.Screen
                name="PlantingLog"
                component={PlantingLogScreen}
                options={{ title: 'Log Planting' }}
            />
            <Stack.Screen
                name="HarvestLog"
                component={HarvestLogScreen}
                options={{ title: 'Log Harvest' }}
            />
            <Stack.Screen
                name="History"
                component={HistoryScreen}
                options={{ title: 'Farm History' }}
            />
            {/* Modals / Subscreens */}
            <Stack.Screen
                name="QRScanner"
                component={QRScannerScreen}
                options={{ presentation: 'modal', headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default AppNavigator;
