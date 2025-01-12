import { View, TouchableOpacity, Text, SafeAreaView } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/styles";
//import ProfileForm from './ProfileForm';
import { Ionicons } from "@expo/vector-icons";
import { fetchData, updateUserData } from "../viewmodel/ProfileViewModel.js";
import { fetchOrder, fetchMenuDetails } from "../viewmodel/HomeViewModel.js";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
  const [sid, setSid] = useState(null);
  const [uid, setUid] = useState(null);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    cardFullName: "",
    cardNumber: "",
    cardExpireMonth: "",
    cardExpireYear: "",
    cardCVV: "",
  });
  const [menuName, setMenuName] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [menuPrice, setMenuPrice] = useState("");
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      const parsedUser = JSON.parse(user);
      const sid = parsedUser.sid;
      const uid = parsedUser.uid;
      setSid(sid);
      setUid(uid);
    });
  }, []);

  useEffect(() => {
    if (sid && uid) {
      fetchData(sid, uid).then((data) => {
        if (data) {
          setUser({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            cardFullName: data.cardFullName || "",
            cardNumber: data.cardNumber || "",
            cardExpireMonth: data.cardExpireMonth || "",
            cardExpireYear: data.cardExpireYear || "",
            cardCVV: data.cardCVV || "",
          });
        }
      });
    }
  }, [sid, uid]);

  useFocusEffect(
    useCallback(() => {
      if (sid && uid) {
        // funzione che carica l'ultimo ordine effettuato dentro una callback che viene eseguita ogni volta che la schermata viene visualizzata
        const loadLastOrder = async () => {
          try {
            const lastOrder = await AsyncStorage.getItem("lastOrder"); // recupera l'ultimo ordine salvato dall'AsyncStorage
            if (lastOrder) {
              const lastOrderParsed = JSON.parse(lastOrder);
              console.log("Last Order Parsed:", lastOrderParsed);

              if (!lastOrderParsed.oid) {
                console.error("OID non valido:", lastOrderParsed.oid);
                return;
              }

              const orderStatus = await fetchOrder(lastOrderParsed.oid, sid); // recupera dal server l'ordine con la fetchOrder
              console.log("Order Status:", orderStatus);
              const menuDetails = await fetchMenuDetails(
                sid,
                lastOrderParsed.mid,
                orderStatus.deliveryLocation.lat,
                orderStatus.deliveryLocation.lng
              ); // recupera i dettagli del menu con la fetchMenuDetails
              console.log("Menu Details:", menuDetails);

              // setto i dati dell'ultimo ordine che ho recuperato
              setOrderData(orderStatus);
              setMenuName(menuDetails.name);
              setMenuDescription(menuDetails.shortDescription);
              setMenuPrice(menuDetails.price);
            } else {
              console.log("Nessun ultimo ordine trovato.");
            }
          } catch (error) {
            console.error(
              "Errore durante il caricamento dell'ultimo ordine:",
              error
            );
          }
        };

        // carica l'ultimo ordine effettuato ogni volta che la schermata viene visualizzata
        loadLastOrder();
        // unsubscribe permette di fermare l'esecuzione della callback quando la schermata non è più visualizzata
        const unsubscribe = navigation.addListener("focus", loadLastOrder);
        return () => unsubscribe();
      }
    }, [sid, uid])
  );

  // funzione che permette di salvare i dati dell'utente
  const handleSave = async (updatedUser) => {
    try {
      // chiamo la funzione updateUserData dal viewmodel per salvare i dati dell'utente aggiornati 
      await updateUserData(sid, uid, updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="person-outline" size={16} /> Nome
          </Text>
          <Text style={styles.value}>{user.firstName}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="people-outline" size={16} /> Cognome
          </Text>
          <Text style={styles.value}>{user.lastName}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="card-outline" size={16} /> Intestatario Carta
          </Text>
          <Text style={styles.value}>{user.cardFullName}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("ProfileForm", {
                user: user,
                onSave: handleSave,
              })
            }
          >
            <Text style={styles.buttonText}>Modifica</Text>
          </TouchableOpacity>
        </View>
      </View>

      {orderData && (
        <View style={styles.orderCard}>
          <Text style={styles.headerText}>Ultimo Ordine</Text>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="fast-food-outline" size={16} /> Menu
            </Text>
            <Text style={styles.value}>{menuName}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="document-text-outline" size={16} /> Descrizione
            </Text>
            <Text style={styles.value}>{menuDescription}</Text>
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="cash-outline" size={16} /> Prezzo
            </Text>
            <Text style={styles.value}>{menuPrice}€</Text>
          </View>
        </View>
      )}
    </View>
  );
}
