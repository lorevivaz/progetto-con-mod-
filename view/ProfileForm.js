import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../style/styles";

export default function ProfileForm({ route, navigation }) {
  const { user, onSave } = route.params;
  const [formUser, setFormUser] = useState(user);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!/^\d{16}$/.test(formUser.cardNumber)) {
      newErrors.cardNumber = "Il numero della carta deve contenere 16 cifre";
    }

    if (!/^1\d{2}$/.test(formUser.cardCVV)) {
      newErrors.cardCVV = 'Il CVV deve contenere 3 cifre e iniziare con "1"';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave(formUser);
      navigation.goBack();
      Alert.alert("Successo", "Dati salvati correttamente.");
    } else {
      Alert.alert("Errore", "Controlla i dati inseriti.");
    }
  };

  return (
    <View style={styles.profileCard}>
      <ScrollView>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="person-outline" size={16} /> Nome
          </Text>
          <TextInput
            style={styles.input}
            value={formUser.firstName}
            onChangeText={(text) => handleChange("firstName", text)}
            placeholder="Inserisci il nome"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="person-outline" size={16} /> Cognome
          </Text>
          <TextInput
            style={styles.input}
            value={formUser.lastName}
            onChangeText={(text) => handleChange("lastName", text)}
            placeholder="Inserisci il cognome"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="card-outline" size={16} /> Intestatario Carta
          </Text>
          <TextInput
            style={styles.input}
            value={formUser.cardFullName}
            onChangeText={(text) => handleChange("cardFullName", text)}
            placeholder="Inserisci l'intestatario della carta"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="card-outline" size={16} /> Numero Carta
          </Text>
          <TextInput
            style={styles.input}
            value={formUser.cardNumber}
            onChangeText={(text) => handleChange("cardNumber", text)}
            placeholder="Inserisci il numero della carta"
          />
          {errors.cardNumber && (
            <Text style={styles.error}>{errors.cardNumber}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="calendar-outline" size={16} /> Scadenza Carta Mesi 
          </Text>
          <TextInput
            style={styles.input}
            value={"" + formUser.cardExpireMonth}
            onChangeText={(text) => handleChange("cardExpireMonth", text)}
            placeholder="Mese"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="calendar-outline" size={16} /> Scadenza Carta Anno 
          </Text>

          <TextInput
            style={styles.input}
            value={"" + formUser.cardExpireYear}
            onChangeText={(text) => handleChange("cardExpireYear", text)}
            placeholder="Anno"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="lock-closed-outline" size={16} /> CVV
          </Text>
          <TextInput
            style={styles.input}
            value={formUser.cardCVV}
            onChangeText={(text) => handleChange("cardCVV", text)}
            placeholder="Inserisci il CVV"
            secureTextEntry
          />
          {errors.cardCVV && <Text style={styles.error}>{errors.cardCVV}</Text>}
        </View>

        <Text style={styles.error}>{errors.general}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#666" }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Annulla</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salva</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
