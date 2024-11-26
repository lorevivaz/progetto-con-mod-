import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchOrder } from '../viewmodel/HomeViewModel';
import * as Location from 'expo-location';

function Order({ route, navigation }) {

   
    

    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        let locationSubscription;

        async function loadOrderAndStartLocationTracking() {
            try {
                // Recupera ordine
                const user = await AsyncStorage.getItem('user');
                const parsedUser = JSON.parse(user);
                const sid = parsedUser.sid;

                let order = route.params?.order;
                if (!order) {
                    const lastOrder = await AsyncStorage.getItem('lastOrder');
                    if (lastOrder) {
                        const parsedOrder = JSON.parse(lastOrder);
                        order = await fetchOrder(parsedOrder.oid, sid);
                    }
                }

                if (!order) {
                    Alert.alert("Errore", "Nessun ordine trovato.");
                    navigation.navigate("Home");
                    return;
                }

                setOrderData(order);

                // Posizione iniziale
                const { latitude, longitude } = location;
                setUserLocation({ latitude, longitude });

                // Tracking posizione
                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.Balanced,
                        timeInterval: 5000,
                        distanceInterval: 10,
                    },
                    (newLocation) => {
                        const { latitude, longitude } = newLocation.coords;
                        setUserLocation({ latitude, longitude });
                    }
                );
            } catch (error) {
                console.error("Errore:", error);
                Alert.alert("Errore", "Impossibile ottenere i dati dell'ordine o della posizione.");
            } finally {
                setLoading(false);
            }
        }

        loadOrderAndStartLocationTracking();

        return () => {
            if (locationSubscription) locationSubscription.remove();
        };
    }, [route.params]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!orderData || !userLocation) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Dettagli dell'ordine o posizione non disponibili.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Card con dettagli dell'ordine */}
            <View style={styles.card}>
                <Text style={styles.title}>Dettagli dell'Ordine</Text>
                <Text style={styles.label}>ID Ordine:</Text>
                <Text style={styles.value}>{orderData.oid}</Text>
                <Text style={styles.label}>Stato:</Text>
                <Text style={styles.value}>{orderData.status}</Text>
                <Text style={styles.label}>Creazione:</Text>
                <Text style={styles.value}>{new Date(orderData.creationTimestamp).toLocaleString()}</Text>
                <Text style={styles.label}>Tempo di consegna:</Text>
                {/* fai un controllo. se deliveryTimestamp è null non stampa nulla */}
                <Text style={styles.value}>{orderData.deliveryTimestamp ? new Date(orderData.deliveryTimestamp).toLocaleString() : ''}</Text>
            </View>

            {/* Mappa */}
            <MapView
                style={styles.map}
                initialCamera={{
                    center: {
                      latitude: userLocation.latitude,
                      longitude: userLocation.longitude,
                    },
                    pitch: 50,
                    heading: 200,
                    zoom: 18,
                  }}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                {/* Marker dell'utente */}
                {userLocation.latitude && userLocation.longitude && (
                    <Marker
                        coordinate={userLocation}
                        title="La tua posizione"
                        pinColor="blue"
                    />
                )}

                {/* Marker dell'ordine */}
                {orderData.currentPosition?.lat && orderData.currentPosition?.lng && (
                    <Marker
                        //voglio passare in modo separato latitude e lonogitude
                        latitude={orderData.currentPosition.lat}
                        longitude={orderData.currentPosition.lng}
                        title="Ordine in consegna"
                        pinColor="green"
                    />
                )}

                {/* Marker della destinazion
                {orderData.deliveryLocation?.latitude && orderData.deliveryLocation?.longitude && (
                    <Marker
                        coordinate={orderData.deliveryLocation}
                        title="Destinazione ordine"
                        pinColor="red"
                    />
                )}
                
                
                */}
                

            
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 14,
        marginBottom: 4,
    },
    map: {
        flex: 1,
    },
    errorText: {
        textAlign: 'center',
        color: 'red',
        marginTop: 20,
    },
});

export default Order;