import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

import Order from "../view/Order";
import Home from "../view/Home";
import Profile from "../view/Profile";
import MenuDetails from "../view/MenuDetails";
import ProfileForm from "../view/ProfileForm";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="Home" 
        component={Home}
      />
      <Stack.Screen 
        name="MenuDetails" 
        component={MenuDetails}
        options={{
          headerTitle: "Dettagli Menu",
          headerBackTitle: "Indietro"
        }}
      />
    </Stack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileMain" 
        component={Profile}
        options={{ headerShown: false }} 
      />
      <ProfileStack.Screen 
        name="ProfileForm" 
        component={ProfileForm}
        options={{
          headerBackTitle: "Indietro"
        }}
      />
    </ProfileStack.Navigator>
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
            if (route.name === "Home") {
              iconName = "home-outline";
            } else if (route.name === "Order") {
              iconName = "fast-food-outline";
            } else if (route.name === "Profile") {
              iconName = "person-outline";
            }
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Order" 
          component={Order} 
          options={{ headerShown: false }}
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileStackScreen}
          options={{ headerShown: false }} 
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}