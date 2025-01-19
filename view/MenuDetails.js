import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  fetchMenuDetails,
  fetchBuy,
  fetchOrder,
} from "../viewmodel/HomeViewModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { handleBuy } from "../viewmodel/buyMenu";

export default function MenuDetails({ route, navigation }) {
  const { menu } = route.params;
  const { location } = route.params;

  const [menuDetails, setMenuDetails] = useState(null);
  const [menuImage, setMenuImage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMenuDetails() {
      try {
        console.log(location.latitude, location.longitude);

        const db = await SQLite.openDatabaseSync("MangiaBasta");

        console.log(
          "Menu:",
          menu.mid,
          "Location:",
          location.latitude,
          location.longitude
        );

        const details = await fetchMenuDetails(
          menu.sid,
          menu.mid,
          location.latitude,
          location.longitude
        );

        setMenuDetails(details);
        console.log("Dettagli del menu:", details);

        const imgQuery = `
                    SELECT base64 FROM MENU WHERE mid = ?;
                `;
        const menuImage = await db.getFirstAsync(imgQuery, [menu.mid]);
        const imageUri = menuImage.base64;

        setMenuImage(imageUri);
      } catch (error) {
        console.error(
          "Errore durante il caricamento dei dettagli del menu:",
          error
        );
      } finally {
        setLoading(false);
      }
    }
    loadMenuDetails();
  }, [menu.mid, location.latitude, location.longitude]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff6f00" />
      </View>
    );
  }

  if (!menuDetails) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Impossibile caricare i dettagli del menu.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.menuName}>{menuDetails.name}</Text>
      {menuImage && (
        <Image source={{ uri: menuImage }} style={styles.menuImage} />
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.menuPrice}>Prezzo: {menuDetails.price}€</Text>

        <Text style={styles.menuDelivery}>
          tempo di consegna: {menuDetails.deliveryTime} min
        </Text>

        <Text style={styles.menuLocation}>
          Posizione : Lat {menuDetails.location.lat}, Lng{" "}
          {menuDetails.location.lng}
        </Text>
      </View>
      <Text style={styles.menuShortDescription}>
        {menuDetails.shortDescription}
      </Text>
      <Text style={styles.menuLongDescription}>
        {menuDetails.longDescription}
      </Text>

      {/* Bottoni affiancati */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.buttonBase, styles.pageButton]}
          onPress={() => navigation.navigate("page", { menu: menuDetails , sid: menu.sid})}
        >
          <Text style={styles.buttonText}>Vai alla pagina</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonBase, styles.buyButton]}
          onPress={() => handleBuy(menu, location, navigation)}
        >
          <Text style={styles.buttonText}>Acquista ora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  menuName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  menuImage: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  menuPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6f00",
    marginBottom: 8,
  },
  menuDelivery: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  menuShortDescription: {
    fontSize: 18,
    fontWeight: "500",
    color: "#555",
    marginBottom: 10,
  },
  menuLongDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Pulsanti distribuiti uniformemente
    alignItems: "center",
    marginTop: 40, // Spazio maggiore dalla parte superiore
    paddingHorizontal: 16,
  },
  buttonBase: {
    borderRadius: 50, // Curve molto arrotondate
    paddingVertical: 18, // Altezza generosa
    alignItems: "center",
    justifyContent: "center",
    width: "48%", // Pulsanti più larghi ma proporzionati
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 6,
    marginHorizontal: 8,
  },
  buyButton: {
    backgroundColor: "#ff6f00",
  },
  pageButton: {
    backgroundColor: "#0066cc",
  },
  buttonText: {
    fontSize: 18, // Testo leggibile e ben visibile
    color: "#fff",
    fontWeight: "bold",
    letterSpacing: 1.0, // Migliora la leggibilità
    textTransform: "uppercase", // Tutto maiuscolo per un aspetto moderno
  },
});
