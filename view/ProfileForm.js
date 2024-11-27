import React, { useState } from 'react';
import { Text, TextInput, View, Button, ScrollView, Alert } from 'react-native';

import styles from '../style/styles.js';

export default function ProfileForm({ user, onInputChange, onSave }) {
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const newErrors = {};

        // Validazione numero carta
        if (!/^\d{16}$/.test(user.cardNumber)) {
            newErrors.cardNumber = 'Il numero della carta deve contenere 16 cifre.';
        }

        // Validazione CVV
        if (!/^1\d{2}$/.test(user.cardCVV)) {
            newErrors.cardCVV = 'Il CVV deve contenere 3 cifre e iniziare con "1".';
        }

        setErrors(newErrors);

        // Ritorna true se non ci sono errori
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateInputs()) {
            onSave();
            Alert.alert('Successo', 'Dati salvati correttamente.');
        } else {
            Alert.alert('Errore', 'Controlla i dati inseriti.');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View>
                <Text style={styles.label}>First Name:</Text>
                <TextInput
                    style={styles.input}
                    value={user.firstName}
                    onChangeText={(text) => onInputChange('firstName', text)}
                />

                <Text style={styles.label}>Last Name:</Text>
                <TextInput
                    style={styles.input}
                    value={user.lastName}
                    onChangeText={(text) => onInputChange('lastName', text)}
                />

                <Text style={styles.label}>Card Full Name:</Text>
                <TextInput
                    style={styles.input}
                    value={user.cardFullName}
                    onChangeText={(text) => onInputChange('cardFullName', text)}
                />

                <Text style={styles.label}>Card Number:</Text>
                <TextInput
                    style={[styles.input, errors.cardNumber && styles.errorInput]}
                    value={user.cardNumber}
                    onChangeText={(text) => onInputChange('cardNumber', text)}
                    keyboardType="numeric"
                    maxLength={16}
                />
                {errors.cardNumber && <Text style={styles.errorText}>{errors.cardNumber}</Text>}

                <Text style={styles.label}>Card Expire Month:</Text>
                <TextInput
                    style={styles.input}
                    value={"" + user.cardExpireMonth}
                    onChangeText={(text) => onInputChange('cardExpireMonth', text)}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Card Expire Year:</Text>
                <TextInput
                    style={styles.input}
                    value={"" + user.cardExpireYear}
                    onChangeText={(text) => onInputChange('cardExpireYear', text)}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>Card CVV:</Text>
                <TextInput
                    style={[styles.input, errors.cardCVV && styles.errorInput]}
                    value={user.cardCVV}
                    onChangeText={(text) => onInputChange('cardCVV', text)}
                    keyboardType="numeric"
                    maxLength={3}
                />
                {errors.cardCVV && <Text style={styles.errorText}>{errors.cardCVV}</Text>}

                <Button title="Save" onPress={handleSave} />
            </View>
        </ScrollView>
    );
}