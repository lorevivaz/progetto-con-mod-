// MenuDetails.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { fetchMenuDetails, fetchImage } from '../model/HomeViewModel';

export default function MenuDetails({ route }) {

    const { menu } = route.params; // qui prendiamo il menu passato come parametro dalla schermata precedente (MenuList)


    const [menuDetails, setMenuDetails] = useState(null);
    const [menuImage, setMenuImage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMenuDetails() {
            try {
                console.log("Menu:", menu.mid, "Location:", menu.location.lat, menu.location.lng);

                const details = await fetchMenuDetails(menu.sid, menu.mid, menu.location.lat, menu.location.lng);

                setMenuDetails(details);
                console.log("Dettagli del menu:", details);
                const imageUri = await fetchImage(menu.sid, menu.mid);
                setMenuImage(imageUri);
            } catch (error) {
                console.error("Errore durante il caricamento dei dettagli del menu:", error);
            } finally {
                setLoading(false);
            }
        }
        loadMenuDetails();
    }, [menu.mid, menu.location.lat, menu.location.lng]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ff6347" />
            </View>
        );
    }

    if (!menuDetails) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Impossibile caricare i dettagli del menu.</Text>
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
                <Text style={styles.menuPrice}>Price: {menuDetails.price}€</Text>

                <Text style={styles.menuDelivery}>Delivery Time: {menuDetails.deliveryTime ? Math.round(menuDetails.deliveryTime / 60) : menu.deliveryTime} min</Text>
                <Text style={styles.menuLocation}>
                    Location: Lat {menuDetails.location.lat}, Lng {menuDetails.location.lng}
                </Text>
            </View>
            <Text style={styles.menuShortDescription}>{menuDetails.shortDescription}</Text>
            <Text style={styles.menuLongDescription}>{menuDetails.longDescription}</Text>

            {/* Pulsante Acquista Ora */}
            <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Acquista Ora</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    menuName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    menuImage: {
        width: '100%',
        height: 220,
        borderRadius: 12,
        marginBottom: 16,
    },
    infoContainer: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginBottom: 16,
    },
    menuPrice: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ff6347',
        marginBottom: 8,
    },
    menuDelivery: {
        fontSize: 16,
        color: '#333',
        marginBottom: 8,
    },
    menuLocation: {
        fontSize: 14,
        color: '#777',
    },
    menuShortDescription: {
        fontSize: 18,
        fontWeight: '500',
        color: '#555',
        marginBottom: 10,
    },
    menuLongDescription: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    errorText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
    },
    buyButton: {
        backgroundColor: '#ff6347',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 30,
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: '#ff6347',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    buyButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
});