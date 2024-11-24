import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { fetchMenuDetails, fetchBuy } from '../viewmodel/HomeViewModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SQLite from 'expo-sqlite';


export default function MenuDetails({ route, navigation }) {

    const {  menu } = route.params; // qui prendiamo il menu passato come parametro dalla schermata precedente (Home.js)


    const [menuDetails, setMenuDetails] = useState(null);
    const [menuImage, setMenuImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleBuyNow = async () => {
        try {
            const response = await fetchBuy(menu.sid, menu.mid, menu.location.lat, menu.location.lng);
            console.log("Acquisto effettuato con successo:", response);
    
            // Salva l'ordine nell'AsyncStorage
            await AsyncStorage.setItem('lastOrder', JSON.stringify({ oid: response.oid, mid: menu.mid }));

            // controllo se l'ordine è stato salvato
            const lastOrder = await AsyncStorage.getItem('lastOrder');
            console.log("L'ordine salvato è:", lastOrder);
    
            // Mostra conferma all'utente
            alert('Acquisto completato con successo!');
    
            // Naviga alla schermata dell'ordine
            navigation.navigate('Order', { order: response });
        } catch (error) {
            console.error("Errore durante l'acquisto del menu:", error);
            alert('Errore durante l’acquisto. Riprova.');
        }
    };


    useEffect(() => {
        async function loadMenuDetails() {
            try {
                const db = await SQLite.openDatabaseSync("MangiaBasta");

                console.log("Menu:", menu.mid, "Location:", menu.location.lat, menu.location.lng);

                const details = await fetchMenuDetails(menu.sid, menu.mid, menu.location.lat, menu.location.lng);

                setMenuDetails(details);
                console.log("Dettagli del menu:", details);
                
                const imgQuery = `
                    SELECT base64 FROM MENU WHERE mid = ?;
                `;
                const menuImage = await db.getFirstAsync(imgQuery, [menu.mid]);
                const imageUri = menuImage.base64;
                
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

                <Text style={styles.menuDelivery}> Delivery Time: {menuDetails.deliveryTime} min</Text>
                <Text style={styles.menuLocation}>
                    Location: Lat {menuDetails.location.lat}, Lng {menuDetails.location.lng}
                </Text>
            </View>
            <Text style={styles.menuShortDescription}>{menuDetails.shortDescription}</Text>
            <Text style={styles.menuLongDescription}>{menuDetails.longDescription}</Text>

            {/* Pulsante Acquista Ora che se cliccato fa la fetchbuy  e mi porta alla pagina order con la mappa */}
            < TouchableOpacity style={styles.buyButton} onPress={handleBuyNow }>
                <Text style={styles.buyButtonText}>Buy Now</Text>
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