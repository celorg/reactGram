import React from 'react';

import {createStackNavigator} from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { StyleSheet } from 'react-native'

import Icon from 'react-native-vector-icons/FontAwesome'

// Pages
import Dashboard from "../pages/Dashboard";
import Profile from '../pages/Profile';

const AppTab = createBottomTabNavigator()

const AppRoutes: React.FC = () => {

    return (
        <AppTab.Navigator initialRouteName='Home' 
            screenOptions={{tabBarStyle: {height: 50, backgroundColor: '#121212'}}}>
            <AppTab.Screen name='Home' component={Dashboard} 
                options={{headerShown:false, 
                    tabBarShowLabel: false,
                    tabBarLabel: "Home", 
                    tabBarIcon :({}) => (
                            <Icon name='home' color="#fafafa" size={30} />
                    )
                }} />
            <AppTab.Screen name='Perfil' component={Profile} 
                options={{
                    headerShown: false,
                    tabBarLabel: "Perfil",
                    tabBarShowLabel: false,
                    tabBarIcon: ({}) => (
                        <Icon name='user' color="#fafafa" size={30} />
                    )
                }}
            />
        </AppTab.Navigator>
    )
}

export default AppRoutes;


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: "center"
    }
})