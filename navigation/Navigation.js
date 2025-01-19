import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Order from "../view/Order";
import Home from "../view/Home";
import Profile from "../view/Profile";
import MenuDetails from "../view/MenuDetails";
import ProfileForm from "../view/ProfileForm";
import page from "../view/page";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const ProfileStack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen
        name="MenuDetails"
        component={MenuDetails}
        options={{
          headerTitle: "Dettagli Menu",
          headerBackTitle: "Indietro",
        }}
      />
      <Stack.Screen
        name="page"
        component={page}
        options={{
          headerTitle: "pagina Menu",
          headerBackTitle: "Indietro",
        }}
      />

    </Stack.Navigator>
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
  const [initialRoute, setInitialRoute] = useState("Home");
  const [isReady, setIsReady] = useState(false); // Per gestire il caricamento iniziale

  // Recupera l'ultima schermata salvata
  useEffect(() => {
    async function getLastVisitedScreen() {
      try {
        const lastScreen = await AsyncStorage.getItem("lastVisitedScreen");
        if (lastScreen) {
          console.log("Ultima schermata recuperata dall'AsyncStorage:", lastScreen);
          setInitialRoute(lastScreen); // Imposta la schermata iniziale
        } else {
          console.log("Nessuna schermata salvata. Avvio da Home.");
        }
      } catch (error) {
        console.error("Errore durante il recupero dell'ultima schermata:", error);
      } finally {
        setIsReady(true); // Imposta lo stato a "pronto"
      }
    }
    getLastVisitedScreen();
  }, []);

  // Salva la schermata quando l'utente cambia tab
  const handleTabChange = async (routeName) => {
    try {
      await AsyncStorage.setItem("lastVisitedScreen", routeName);
      console.log("Schermata salvata nell'AsyncStorage:", routeName);
    } catch (error) {
      console.error("Errore durante il salvataggio della schermata:", error);
    }
  };

  // Mostra un caricamento iniziale finché non è pronto
  if (!isReady) {
    return null; // Mostra uno stato di caricamento, come uno spinner, se necessario
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={initialRoute}
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

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        screenListeners={{
          state: (e) => {
            const routeName = e.data.state.routes[e.data.state.index].name;
            console.log("Navigazione verso la schermata:", routeName); // Log della navigazione
            handleTabChange(routeName);
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
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