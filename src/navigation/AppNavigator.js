import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import UserRegistrationScreen from '../screens/UserRegistrationScreen';
import FarmRegistrationScreen from '../screens/FarmRegistrationScreen';


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
        </Stack.Navigator>
    );
};

export default AppNavigator;
