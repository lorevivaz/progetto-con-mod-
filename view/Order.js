import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchOrder } from "../viewmodel/HomeViewModel";
import { Image } from "react-native";

function Order({ navigation }) {
  const [orderData, setOrderData] = useState({
    currentPosition: { lat: null, lng: null },
  });

  const [loading, setLoading] = useState(true);

  const [droneLocation, setDroneLocation] = useState({ lat: null, lng: null });
  const [sid, setSid] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      const parsedUser = JSON.parse(user);
      const sid = parsedUser.sid;
      setSid(sid);
    });
  }, []);

  async function loadOrderAndStartLocationTracking() {
    try {
      // Recupera ordine
      const lastOrder = await AsyncStorage.getItem("lastOrder");
      if (!lastOrder) {
        Alert.alert("Errore", "Nessun ordine trovato.");
        navigation.navigate("Home");
        return;
      } else {
        const parsedOrder = JSON.parse(lastOrder);
        const order = await fetchOrder(parsedOrder.oid, sid);
        setOrderData(order);
      }
    } catch (error) {
      console.error("Errore:", error);
      Alert.alert(
        "Errore",
        "Impossibile ottenere i dati dell'ordine o della posizione."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sid) {
      let locationSubscription;

      loadOrderAndStartLocationTracking();

      const intervalId = setInterval(async () => {
        const lastOrder = await AsyncStorage.getItem("lastOrder");
        const parsedOrder = JSON.parse(lastOrder);

        const existingOrder = await fetchOrder(parsedOrder.oid, sid);
        setDroneLocation({
          lat: existingOrder.currentPosition.lat,
          lng: existingOrder.currentPosition.lng,
        });
      }, 5000); // Intervallo di 5 secondi

      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
        clearInterval(intervalId);
      };
    }
  }, [sid, droneLocation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!orderData ) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Dettagli dell'ordine o posizione non disponibili.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Card con dettagli dell'ordine */}
      <View style={styles.card}>
        <Text style={styles.title}>Dettagli dell'Ordine</Text>
        <Text style={styles.label}>ID Ordine:</Text>
        <Text style={styles.value}>{orderData.oid}</Text>
        <Text style={styles.label}>Stato:</Text>
        <Text style={styles.value}>{orderData.status}</Text>
        <Text style={styles.label}>Creazione:</Text>
        <Text style={styles.value}>
          {new Date(orderData.creationTimestamp).toLocaleString()}
        </Text>
        
        <Text style={styles.label}>
          {orderData.deliveryTimestamp
            ? 'Tempo di consegna:'
            :""}
        </Text>

        <Text style={styles.value}>
          {orderData.deliveryTimestamp
            ? new Date(orderData.deliveryTimestamp).toLocaleString()
            : ""}
        </Text>
      </View>

      {/* Mappa */}
      <MapView
        style={styles.map}
        initialCamera={{
          center: {
            latitude: orderData.deliveryLocation.lat,
            longitude: orderData.deliveryLocation.lng,
          },
          pitch: 50,
          heading: 200,
          zoom: 18,
        }}
        showsMyLocationButton={true}
      >
    
 {/* Marker del drone  */}
 {droneLocation?.lat && droneLocation.lng && (
          <Marker
          coordinate={{
            latitude: droneLocation.lat,
            longitude: droneLocation.lng,
          }}
        >
          <Image
            source={require('../assets/icon-drone.png')} // Assicurati che l'immagine esista in questo percorso
            style={{ width: 30, height: 30 }}
          />
        </Marker>
        )}

        {/* Marker del user */}

        {orderData.deliveryLocation?.lat && orderData.deliveryLocation?.lng && (
          <Marker
            coordinate={{
              latitude: orderData.deliveryLocation.lat,
              longitude: orderData.deliveryLocation.lng,
            }}
            title="posizione di consegna"
            pinColor="red"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
  },
  value: {
    fontSize: 14,
    marginBottom: 4,
  },
  map: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
  iconContainer: {
    alignItems: "center",
  },
  markerText: {
    fontSize: 12,
    color: "#000",
    marginTop: 4,
    textAlign: "center",
  },
});

export default Order;
