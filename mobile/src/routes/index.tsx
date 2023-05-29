import React, {useContext} from 'react';

import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Routes: React.FC = () => {

    const { authenticated,loading } = useContext(AuthContext);

    if(loading){
        return (
            <View style={{flex: 1,backgroundColor:"#121212", justifyContent: 'center', alignItems:'center'}}>
                <ActivityIndicator color="#fff" size={50} />
            </View>
        )    
    }

    return (
        authenticated ? <AppRoutes/> : <AuthRoutes /> 
    )
}

export default Routes;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})