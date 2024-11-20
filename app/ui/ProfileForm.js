import React from 'react';
import { Text, TextInput, View, Button, ScrollView } from 'react-native';

import styles from '../style/styles.js';

export default function ProfileForm({ user, onInputChange, onSave }) {
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
                style={styles.input}
                value={user.cardNumber}
                onChangeText={(text) => onInputChange('cardNumber', text)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Card Expire Month:</Text>
            <TextInput
                style={styles.input}
                value={user.cardExpireMonth}
                onChangeText={(text) => onInputChange('cardExpireMonth', text)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Card Expire Year:</Text>
            <TextInput
                style={styles.input}
                value={user.cardExpireYear}
                onChangeText={(text) => onInputChange('cardExpireYear', text)}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Card CVV:</Text>
            <TextInput
                style={styles.input}
                value={user.cardCVV}
                onChangeText={(text) => onInputChange('cardCVV', text)}
                keyboardType="numeric"
            />

            <Button title="Save" onPress={onSave} />
        </View>
        </ScrollView>
    );
}
