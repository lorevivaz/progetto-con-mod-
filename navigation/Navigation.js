import * as React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import Details from "../view/Details";
import Home from '../view/Home';
import Profile from '../view/Profile';
import MenuDetails from '../view/MenuDetails';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="MenuDetails" component={MenuDetails} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Details') {
              iconName = 'list-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            }

            // Restituisce l'icona corrispondente
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Details" component={Details} />
        <Tab.Screen name="Profile" component={Profile} />

      </Tab.Navigator>



    </NavigationContainer>
  );
}