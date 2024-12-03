import { View, Text, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/styles";
import { Ionicons } from '@expo/vector-icons';
import { fetchData, updateUserData } from "../viewmodel/ProfileViewModel";

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

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      const parsedUser = JSON.parse(user);
      setSid(parsedUser.sid);
      setUid(parsedUser.uid);
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

  const handleSave = async (updatedUser) => {
    try {
      await updateUserData(sid, uid, updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.headerText}>Profilo Utente</Text>
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
              onPress={() => navigation.navigate('ProfileForm', {
                user: user,
                onSave: handleSave
              })}
            >
              <Text style={styles.buttonText}>Modifica</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#34a853' }]}
              onPress={() => navigation.navigate("Order")}
            >
              <Text style={styles.buttonText}>Ordini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}