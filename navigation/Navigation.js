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
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen
        name="MenuDetails"
        component={MenuDetails}
        options={{
          headerTitle: "Dettagli Menu",
          headerBackTitle: "Indietro",
        }}
      />
    </HomeStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerTitle: "Profilo",
        }}
      />
      <ProfileStack.Screen
        name="ProfileForm"
        component={ProfileForm}
        options={{
          headerBackTitle: "Indietro",
          headerTitle: "Modifica Profilo",
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
            } else if (route.name === "Ordini") {
              iconName = "fast-food-outline";
            } else if (route.name === "Profilo") {
              iconName = "person-outline";
            }

            // Restituisce l'icona corrispondente
            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeStackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Ordini"
          component={Order}
          options={{ headerShown: true }}
        />
        <Tab.Screen
          name="Profilo"
          component={ProfileStackScreen}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
