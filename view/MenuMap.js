import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  Animated, 
  ActivityIndicator 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";
import { locationPermissionAsync } from "../component/MapComponent";
import { fetchMenu } from "../viewmodel/HomeViewModel";
import { handleBuy } from "../viewmodel/buyMenu";

export default function MenuMap({ navigation }) {
  const [menuData, setMenuData] = useState([]);
  const [sid, setSid] = useState(null);
  const [uid, setUid] = useState(null);
  const [location, setLocation] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0)); // Per animazione di comparsa della card
  const [isLoading, setIsLoading] = useState(true); // Stato per indicare il caricamento

  // Recupera i dati utente da AsyncStorage
  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await AsyncStorage.getItem("user");
        const parsedUser = JSON.parse(user);
        if (parsedUser) {
          setSid(parsedUser.sid);
          setUid(parsedUser.uid);
        }
      } catch (error) {
        console.log("Errore nel caricamento dell'utente:", error.message);
      }
    }
    loadUserData();
  }, []);

  // Recupera la posizione e il menu
  useEffect(() => {
    async function loadMenu() {
      if (sid && uid) {
        try {
          const location = await locationPermissionAsync();

          if (location) {
            setLocation(location);

            // Recupera il menu in base alla posizione
            const menu = await fetchMenu(location.latitude, location.longitude, sid);
            setMenuData(menu);
          }
        } catch (error) {
          console.log("Errore nel caricamento del menu:", error.message);
        } finally {
          setIsLoading(false); // Fine del caricamento
        }
      }
    }

    loadMenu();
  }, [sid, uid]);

  // Anima la comparsa/scomparsa della card quando un menu viene selezionato
  useEffect(() => {
    if (selectedMenu) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedMenu]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        // Mostra un loader durante il caricamento
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff6f00" />
          <Text>Caricamento in corso...</Text>
        </View>
      ) : (
        <>
          {location && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
             
            >
              {/* Marker dei menu */}
              {menuData.map((item, index) => {
                const { lat, lng } = item.location;
                return (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: lat,
                      longitude: lng,
                    }}
                    title={item.name}
                    onPress={() => setSelectedMenu(item)}
                  >
                    <Image
                      source={require("../assets/icon-risto.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </Marker>
                );
              })}

              {/* Marker della posizione di consegna */}
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                title="Posizione di consegna"
                onPress={() => setSelectedMenu(null)}
              >
                <Image
                  source={require("../assets/icon-casa.png")}
                  style={{ width: 30, height: 30 }}
                />
              </Marker>
            </MapView>
          )}

          {/* Dettagli del menu selezionato */}
          {selectedMenu && (
            <Animated.View
              style={[
                styles.menuDetails,
                { opacity: fadeAnim }, // Gestione dell'opacità per l'animazione
              ]}
            >
              <Text style={styles.menuName}>{selectedMenu.name}</Text>
              <Text style={styles.menuDescription}>
                {selectedMenu.shortDescription}
              </Text>
              <Text style={styles.menuTime}>
                Tempo di consegna: {selectedMenu.deliveryTime} min
              </Text>
              <Text style={styles.menuPrice}>Prezzo: {selectedMenu.price}€</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() =>
                  handleBuy(selectedMenu, location, navigation, sid)
                }
              >
                <Text style={styles.buttonText}>Acquista ora</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  menuDetails: {
    position: "absolute",
    bottom: 30, // Sopra la barra di navigazione
    left: 10,
    right: 10,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  menuPrice: {
    fontSize: 16,
    color: "#ff6f00",
    fontWeight: "bold",
  },
  menuTime: {
    fontSize: 14,
    color: "#777",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#ff6f00",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});