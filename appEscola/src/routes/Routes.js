import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import Login from '../screens/Login';
import Cadastro from '../screens/Cadastro';
import CadProf from '../screens/CadProf';
import TelaAtivs from '../screens/TelaAtivs';
import TelaProf from '../screens/TelaProf';

const Stack = createNativeStackNavigator();

export default function NativeStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Cadastro" component={Cadastro} />
                <Stack.Screen name="CadProf" component={CadProf} />
                <Stack.Screen name="TelaAtivs" component={TelaAtivs} />
                <Stack.Screen name="TelaProf" component={TelaProf} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}