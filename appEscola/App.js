import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import Login from './src/screens/Login';
import TelaProf from './src/screens/TelaProf';
import CadastroProf from './src/screens/CadastroProf';
import TelaAtivs from './src/screens/TelaAtivs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabsNavigator() {
  return (
    <Tab.Navigator
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
            iconName = 'person-sharp';
          } else if (route.name === 'Novo professor') {
            iconName = 'add-circle';
          } else if (route.name === 'Atividades') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Professor" component={TelaProf} />
      <Tab.Screen name="Novo professor" component={CadastroProf} />
      <Tab.Screen name="Atividades" component={TelaAtivs} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Tabs" component={TabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}