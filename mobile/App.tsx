import React from 'react';

import { View, StatusBar } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import Routes from './src/routes';
import { AuthProvider } from './src/context/AuthContext';

const App: React.FC = () => {
    return(
        <AuthProvider>
            <NavigationContainer>
                <StatusBar backgroundColor={'#121212'} barStyle="light-content" translucent={false} />
                <Routes />
            </NavigationContainer>
        </AuthProvider>
        
    )
}

export default App;