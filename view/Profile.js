import {
  View,
  TouchableOpacity,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "../style/styles";
import ProfileForm from "./ProfileForm";

import { fetchData, updateUserData } from "../viewmodel/ProfileViewModel";

export default function ProfileScreen({ navigation }) {
  const [sid, setSid] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("user").then((user) => {
      const parsedUser = JSON.parse(user);
      const sid = parsedUser.sid;
      const uid = parsedUser.uid;
      setSid(sid);
      setUid(uid);
    });
  }, []);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    cardFullName: "",
    cardNumber: "",
    cardExpireMonth: "",
    cardExpireYear: "",
    cardCVV: "",
  });

  const [isEditing, setIsEditing] = useState(false);

  const data = [
    { id: "1", label: "First Name", value: user.firstName },
    { id: "2", label: "Last Name", value: user.lastName },
    { id: "3", label: "Card Full Name", value: user.cardFullName },
  ];

  useEffect(() => {
    if (sid && uid) {
      fetchData(sid, uid).then((data) => {
        if (data) {
          setUser({
            firstName: data.firstName,
            lastName: data.lastName,
            cardFullName: data.cardFullName,
            cardNumber: data.cardNumber,
            cardExpireMonth: data.cardExpireMonth,
            cardExpireYear: data.cardExpireYear,
            cardCVV: data.cardCVV,
          });
        }
      });
    }
  }, [sid, uid]);

  const handleInputChange = (field, value) => {
    setUser((prevUser) => ({ ...prevUser, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateUserData(sid, uid, user);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user data:", error);
    }
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <ProfileForm
          user={user}
          onInputChange={handleInputChange}
          onSave={handleSave}
        />
      ) : (
        <View style={styles.view}>
          <View style={styles.row}>
            <View style={styles.item}>
              <Text style={styles.label}>First Name:</Text>
              <Text style={styles.value}>{user.firstName}</Text>
            </View>
            <View style={styles.item}>
              <Text style={styles.label}>Last Name:</Text>
              <Text style={styles.value}>{user.lastName}</Text>
            </View>
          </View>
          <View style={[styles.item, styles.fullWidthItem]}>
            <Text style={styles.cardFullNameLabel}>Card Full Name:</Text>
            <Text style={styles.value}>{user.cardFullName}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.bottone}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.bottoneTesto}>Modifica Profilo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bottone}
              onPress={() => navigation.navigate("Order")}
            >
              <Text style={styles.bottoneTesto}>Vai a Ordine</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
