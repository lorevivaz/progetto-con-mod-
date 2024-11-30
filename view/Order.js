import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchOrder, fetchMenuDetails } from "../viewmodel/HomeViewModel";
import { Image } from "react-native";

function Order({ navigation }) {

 // prendiamo il menuDetails passato come parametro dalla schermata MenuDetails.js
  
  const [menuDetails, setMenuDetails] = useState(null);
  const [orderData, setOrderData] = useState();
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
        // faccio la chiamata fetchMenuDetails per recuperare i dettagli del menu
        const menuDetails = await fetchMenuDetails(sid, parsedOrder.mid, order.deliveryLocation.lat, order.deliveryLocation.lng);
        setOrderData(order);
        setMenuDetails(menuDetails);
        
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

  if (!orderData || !droneLocation.lat || !droneLocation.lng) {
    return (
      <View style={styles.containerError}>
        <Text style={styles.errorText}>
          non hai ancora effettuato un ordine.
        </Text>
        <Button
          title="vai a fare il tuo primo ordine"
          onPress={() => navigation.navigate("Home")}
        />
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
        <Text style={styles.label}>Menu:</Text>
        <Text style={styles.value}>{menuDetails.name}</Text>
        <Text style={styles.label}>Stato:</Text>
        <Text style={styles.value}>{orderData.status}</Text>
        <Text style={styles.label}>Creazione:</Text>
        <Text style={styles.value}>{new Date(orderData.creationTimestamp).toLocaleString()}</Text>
        <Text style={styles.label}>{orderData.deliveryTimestamp ? 'Tempo di consegna:' : ""}</Text>
        <Text style={styles.value}>
            {orderData.deliveryTimestamp
                ? new Date(orderData.deliveryTimestamp).toLocaleString()
                : ""}
        </Text>
      </View>
        
        {/* Mappa con posizione del ristorante e del drone */}
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
 {/* Marker del drone si vede solo se stautus è ONDelivery */}
 
         {droneLocation?.lat && droneLocation.lng && (
          <Marker
          coordinate={{
            latitude: droneLocation.lat,
            longitude: droneLocation.lng,
          }}
        >
          <Image
            source={require('../assets/icon-drone.png')} 
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

        {/* Marker del ristorante */}
        {menuDetails.location?.lat && menuDetails.location?.lng && (
          <Marker
            coordinate={{
              latitude: menuDetails.location.lat,
              longitude: menuDetails.location.lng,
            }}
            title="ristorante"
            pinColor="blue"
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
 containerError: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
