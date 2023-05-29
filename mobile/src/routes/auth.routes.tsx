import React from 'react';

import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "../pages/SignIn";
import Register from "../pages/Register";

export type StackParamsList = {
    Register: undefined;
    SignIn: undefined;
}

const AuthStack = createStackNavigator<StackParamsList>();

const AuthRoutes: React.FC = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="SignIn" component={SignIn} options={{ headerShown:false }} />
            <AuthStack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
}

export default AuthRoutes;