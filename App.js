import React, { useEffect, useState } from "react";
import Navigation from "./navigation/Navigation";
import CommunicationController from "./model/ComunicationController";
import { StyleSheet, ActivityIndicator, View, Text } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = async () => {
    try {
      // Simulate registration delay
      setTimeout(async () => {
        // Check if user is already registered
        const user = await AsyncStorage.getItem("user");
        if (user) {
          setUser(JSON.parse(user));
          console.log("User already registered: " + user);
          //await dbSetUp(user);
          setLoading(false);
          return;
        } else {
          const userData = await CommunicationController.register();
          setUser(userData);
          console.log("registering user: " + JSON.stringify(userData));
          await AsyncStorage.setItem("user", JSON.stringify(userData));
          //await dbSetUp(JSON.stringify(userData));
          setLoading(false);
        }
      }, 3000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.error("useRegister Errors: " + error);
      setLoading(false);
    }
  };

  useEffect(() => {
    registerUser();
  }, []);

  return (
    <>
      {loading ? (
        <View style={styles.loaderContainer}>
          <View style={styles.scaledIndicator}>
            <ActivityIndicator size="large" color="#ff6f00" />
          </View>
          <Text style={styles.loaderText}>Caricamento in corso...</Text>
        </View>
      ) : (
        user && <Navigation />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  scaledIndicator: {
    transform: [{ scale: 2 }], // Scala il loader per renderlo più grande
  },
  loaderText: {
    marginTop: 16, // Spazio tra il testo e l'ActivityIndicator
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff6347",
  },
});
