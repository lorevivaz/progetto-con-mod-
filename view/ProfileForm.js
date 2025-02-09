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
  const { user, onSave } = route.params; // qui prendiamo l'utente passato come parametro dalla schermata precedente (Profile.js) e la funzione onSave per salvare i dati
  const [formUser, setFormUser] = useState(user);
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    //controllo se i campi del nome, cognome e intestatario carta sono vuoti
    if (!formUser.firstName) {
      newErrors.firstName = "Il nome è obbligatorio";
    }

    if (!formUser.lastName) {
      newErrors.lastName = "Il cognome è obbligatorio";
    }

    if (!formUser.cardFullName) {
      newErrors.cardFullName = "L'intestatario della carta è obbligatorio";
    }

    // controllo se il numero della carta è composto da 16 cifre
    if (!/^\d{16}$/.test(formUser.cardNumber)) {
      newErrors.cardNumber = "Il numero della carta deve contenere 16 cifre";
    }
    // controllo se il CVV è composto da 3 cifre e inizia con 1
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
      <ScrollView showsVerticalScrollIndicator={false}>
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
          {errors.firstName && (
            <Text style={styles.error}>{errors.firstName}</Text>
          )}
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
          {errors.lastName && (
            <Text style={styles.error}>{errors.lastName}</Text>
          )}
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
          {errors.cardFullName && (
            <Text style={styles.error}>{errors.cardFullName}</Text>
          )}
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

        <View style={styles.rowContainer}>
          <View style={styles.halfFieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="calendar-outline" size={16} /> Mese
            </Text>
            <TextInput
              style={styles.input}
              value={"" + formUser.cardExpireMonth}
              onChangeText={(text) => handleChange("cardExpireMonth", text)}
              placeholder="MM"
              keyboardType="numeric"
              maxLength={2}
            />
          </View>

          <View style={styles.halfFieldContainer}>
            <Text style={styles.label}>
              <Ionicons name="calendar-outline" size={16} /> Anno
            </Text>
            <TextInput
              style={styles.input}
              value={"" + formUser.cardExpireYear}
              onChangeText={(text) => handleChange("cardExpireYear", text)}
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
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
