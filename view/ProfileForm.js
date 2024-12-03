import React, { useState } from "react";
import { Text, TextInput, View, ScrollView, Alert, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import styles from "../style/styles";

export default function ProfileForm({ user, onInputChange, onSave }) {
  const [errors, setErrors] = useState({});

  const validateInputs = () => {
    const newErrors = {};

    if (!/^\d{16}$/.test(user.cardNumber)) {
      newErrors.cardNumber = "Il numero della carta deve contenere 16 cifre.";
    }

    if (!/^1\d{2}$/.test(user.cardCVV)) {
      newErrors.cardCVV = 'Il CVV deve contenere 3 cifre e iniziare con "1".';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateInputs()) {
      onSave();
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
            value={user.firstName}
            onChangeText={(text) => onInputChange("firstName", text)}
            placeholder="Inserisci il nome"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="people-outline" size={16} /> Cognome
          </Text>
          <TextInput
            style={styles.input}
            value={user.lastName}
            onChangeText={(text) => onInputChange("lastName", text)}
            placeholder="Inserisci il cognome"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="card-outline" size={16} /> Intestatario Carta
          </Text>
          <TextInput
            style={styles.input}
            value={user.cardFullName}
            onChangeText={(text) => onInputChange("cardFullName", text)}
            placeholder="Inserisci il nome sulla carta"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="card-outline" size={16} /> Numero Carta
          </Text>
          <TextInput
            style={[styles.input, errors.cardNumber && styles.errorInput]}
            value={user.cardNumber}
            onChangeText={(text) => onInputChange("cardNumber", text)}
            keyboardType="numeric"
            maxLength={16}
            placeholder="1234 5678 9012 3456"
          />
          {errors.cardNumber && (
            <Text style={styles.errorText}>{errors.cardNumber}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="calendar-outline" size={16} /> Mese di Scadenza
          </Text>
          <TextInput
            style={styles.input}
            value={"" + user.cardExpireMonth}
            onChangeText={(text) => onInputChange("cardExpireMonth", text)}
            keyboardType="numeric"
            maxLength={2}
            placeholder="MM"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="calendar-outline" size={16} /> Anno di Scadenza
          </Text>
          <TextInput
            style={styles.input}
            value={""+ user.cardExpireYear}
            onChangeText={(text) => onInputChange("cardExpireYear", text)}
            keyboardType="numeric"
            maxLength={4}
            placeholder="YYYY"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            <Ionicons name="lock-closed-outline" size={16} /> CVV
          </Text>
          <TextInput
            style={[styles.input, errors.cardCVV && styles.errorInput]}
            value={user.cardCVV}
            onChangeText={(text) => onInputChange("cardCVV", text)}
            keyboardType="numeric"
            maxLength={3}
            placeholder="123"
            secureTextEntry
          />
          {errors.cardCVV && (
            <Text style={styles.errorText}>{errors.cardCVV}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Salva</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}