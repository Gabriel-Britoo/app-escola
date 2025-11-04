import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Login from './src/screens/Login';
import TelaProf from './src/screens/TelaProf';

const Tab = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator >
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="prof" component={TelaProf} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default TabsNavigator;