import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchOrder, fetchMenuDetails } from "../viewmodel/HomeViewModel";
import { useFocusEffect } from "@react-navigation/native";

function Order({ navigation }) {
  const [menuDetails, setMenuDetails] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [droneLocation, setDroneLocation] = useState({ lat: null, lng: null });
  const [sid, setSid] = useState(null);
  const [noOrder, setNoOrder] = useState(false);

  // Recupera il SID al montaggio del componente
  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      if (user) {
        const parsedUser = JSON.parse(user);
        setSid(parsedUser.sid);
      }
    });
  }, []);

  // Funzione per caricare i dati iniziali
  async function loadOrderData() {
    setLoading(true);

    if (!sid) {
      setNoOrder(true);
      setLoading(false);
      return;
    }

    try {
      const lastOrder = await AsyncStorage.getItem("lastOrder");
      if (!lastOrder) {
        setNoOrder(true);
        return;
      }

      const parsedOrder = JSON.parse(lastOrder);
      if (!parsedOrder || !parsedOrder.oid) {
        setNoOrder(true);
        return;
      }

      const order = await fetchOrder(parsedOrder.oid, sid);
      const menuDetails = await fetchMenuDetails(
        sid,
        parsedOrder.mid,
        order.deliveryLocation.lat,
        order.deliveryLocation.lng
      );

      setOrderData(order);
      setMenuDetails(menuDetails);
      setNoOrder(false);
    } catch (error) {
      console.error("Errore durante il caricamento dei dati:", error);
      Alert.alert("Errore", "Impossibile ottenere i dati dell'ordine.");
    } finally {
      setLoading(false);
    }
  }

  // Funzione per avviare il tracking del drone
  const startDroneTracking = () => {
    return setInterval(async () => {
      try {
        const lastOrder = await AsyncStorage.getItem("lastOrder");
        if (!lastOrder) return;

        const parsedOrder = JSON.parse(lastOrder);
        if (!parsedOrder || !parsedOrder.oid) return;

        const updatedOrder = await fetchOrder(parsedOrder.oid, sid);

        setDroneLocation({
          lat: updatedOrder.currentPosition.lat,
          lng: updatedOrder.currentPosition.lng,
        });

        setOrderData(updatedOrder);

        if (updatedOrder.status === "COMPLETED") {
          clearInterval(droneInterval);
          Alert.alert(
            "Ordine completato",
            "Il tuo ordine è arrivato a destinazione."
          );
        }
      } catch (error) {
        console.error("Errore durante l'aggiornamento della posizione:", error);
      }
    }, 5000);
  };

  // Usa useFocusEffect per gestire i dati e il tracking
  let droneInterval = null;

  useFocusEffect(
    useCallback(() => {
      loadOrderData();

      if (!noOrder) {
        droneInterval = startDroneTracking();
      }

      return () => {
        if (droneInterval) clearInterval(droneInterval);
      };
    }, [sid, noOrder])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (noOrder) {
    return (
      <View style={styles.containerError}>
        <Text style={styles.errorText}>
          Non hai ancora effettuato un ordine. Effettua il tuo primo ordine!
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Vai alla Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Card con dettagli dell'ordine */}
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>📦 Dettagli dell'Ordine</Text>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>ID Ordine:</Text>
            <Text style={styles.value}>{orderData.oid}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>🍔 Menu:</Text>
            <Text style={styles.value}>{menuDetails.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>📜 Stato:</Text>
            <Text style={styles.value}>{orderData.status}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>⏰ Data di creazione:</Text>
            <Text style={styles.value}>
              {new Date(orderData.creationTimestamp).toLocaleString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>
              {orderData.deliveryTimestamp
                ? "🚚 Data di consegna:"
                : "📅 Arrivo previsto:"}
            </Text>
            <Text style={styles.value}>
              {orderData.deliveryTimestamp
                ? new Date(orderData.deliveryTimestamp).toLocaleString()
                : new Date(
                    orderData.expectedDeliveryTimestamp
                  ).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Mappa con i marker per la consegna, il ristorante e il drone */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude:
            (orderData.deliveryLocation.lat + menuDetails.location.lat) / 2,
          longitude:
            (orderData.deliveryLocation.lng + menuDetails.location.lng) / 2,
          latitudeDelta:
            Math.abs(
              orderData.deliveryLocation.lat - menuDetails.location.lat
            ) * 2,
          longitudeDelta:
            Math.abs(
              orderData.deliveryLocation.lng - menuDetails.location.lng
            ) * 2,
        }}
        showsPointsOfInterest={false}
        showsBuildings={false}
        showsIndoors={false}
        showsCompass={false}
        showsTraffic={false}
      >
        {/* Marker del drone */}
        {droneLocation.lat &&
          droneLocation.lng &&
          orderData.status !== "COMPLETED" && (
            <Marker
              coordinate={{
                latitude: droneLocation.lat,
                longitude: droneLocation.lng,
              }}
              title="Posizione del drone"
            >
              <Image
                source={require("../assets/icon-drone.png")}
                style={{ width: 30, height: 30 }}
              />
            </Marker>
          )}

        {/* Marker della consegna */}
        {orderData.deliveryLocation.lat && orderData.deliveryLocation.lng && (
          <Marker
            coordinate={{
              latitude: orderData.deliveryLocation.lat,
              longitude: orderData.deliveryLocation.lng,
            }}
            title="Posizione di consegna"
          >
            <Image
              source={require("../assets/icon-casa.png")}
              style={{ width: 30, height: 30 }}
            />
          </Marker>
        )}

        {/* Marker del ristorante */}
        {menuDetails.location?.lat && menuDetails.location?.lng && (
          <Marker
            coordinate={{
              latitude: menuDetails.location.lat,
              longitude: menuDetails.location.lng,
            }}
            title="Ristorante"
          >
            <Image
              source={require("../assets/icon-risto.png")}
              style={{ width: 30, height: 30 }}
            />
          </Marker>
        )}
      </MapView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5", // Sfondo chiaro per tutta la schermata
  },
  cardContainer: {
    backgroundColor: "#ffffff", // Sfondo bianco per la card
    borderRadius: 16, // Angoli arrotondati più pronunciati
    marginHorizontal: 16,
    marginTop: 20,
    elevation: 6, // Ombra su Android
    shadowColor: "#000", // Ombra su iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    overflow: "hidden", // Per bordi arrotondati
  },
  cardHeader: {
    backgroundColor: "#ff6f00", // Arancione vivace per il titolo
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 10, // Arrotondamento dei bordi inferiori
    borderBottomRightRadius: 10,
  },
  title: {
    color: "#fff", // Colore del testo del titolo
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase", // Maiuscolo
    letterSpacing: 1, // Spaziatura tra le lettere
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#f9f9f9", // Sfondo chiaro per il contenuto
  },
  infoRow: {
    flexDirection: "row", // Disposizione orizzontale
    justifyContent: "space-between", // Spazio tra etichetta e valore
    alignItems: "center",
    marginBottom: 12, // Spaziatura tra le righe
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444", // Grigio per le etichette
    flex: 1, // Per allineamento uniforme
  },
  value: {
    fontSize: 16,
    color: "#222", // Grigio scuro per i valori
    flex: 2, // Più spazio per i valori
    textAlign: "right",
  },
  map: {
    flex: 1,
    marginTop: 10, // Spaziatura tra la card e la mappa
    borderRadius: 12, // Bordo arrotondato per la mappa
  },
  containerError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#ff6f00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Order;
