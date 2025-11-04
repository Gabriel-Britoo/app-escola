import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import 'react-native-gesture-handler';
import Login from './src/screens/Login'
import TelaProf from './src/screens/TelaProf';
import CadastroProf from './src/screens/CadastroProf';
import TelaAtivs from './src/screens/TelaAtivs';

import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      initialRouteName="Login"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
            elevation: 5,
            height: 60,
        },
        tabBarActiveTintColor: '#D84040',
          tabBarInactiveTintColor: '#AAA',
          tabBarIcon: ({ color, size, focused }) => {
            let iconName;

            if (route.name === 'Professor') {
              color = focused ? '#D84040' : '#AAA';
              iconName = focused ? 'person-sharp' : 'person-sharp';
            } else if (route.name === 'Novo professor') {
              color = focused ? '#D84040' : '#AAA';
              iconName = focused ? 'add-circle' : 'add-circle';
            } else if (route.name === 'Atividades') {
              iconName = focused ? 'list' : 'list-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
      })}
      >
        <Tab.Screen name="Login" component={Login} options={{ headerShown: false, tabBarItemStyle: { display: 'none' } }} />
        <Tab.Screen name="Professor" component={TelaProf} options={{ headerShown: false }} />
        <Tab.Screen name="Novo professor" component={CadastroProf} options={{ headerShown: false }} />
        <Tab.Screen name="Atividades" component={TelaAtivs} options={{ headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
export default TabsNavigator;