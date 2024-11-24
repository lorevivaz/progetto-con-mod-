import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchOrder } from '../viewmodel/HomeViewModel';

function Order({ route }) {



    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [sid, setSid] = useState(null);

    useEffect(() => {
        // recupera l'utente dall'AsyncStorage e imposta il sid
        AsyncStorage.getItem('user').then((user) => {
            const parsedUser = JSON.parse(user);
            const sid = parsedUser.sid;
            setSid(sid);
        });
    }, []);




    useEffect(() => {
        if (sid) {
            async function loadOrder() {
                try {
                    let order = route.params?.order;

                    // Se non ci sono dati, recupera l'oid dall'AsyncStorage
                    if (!order) {
                        const lastOrder = await AsyncStorage.getItem('lastOrder');
                        if (lastOrder) {
                            const parsedOrder = JSON.parse(lastOrder);
                            const oid = parsedOrder?.oid;
                            const mid = parsedOrder?.mid;

                            // Fetch dei dettagli ordine con l'oid recuperato
                            if (oid && mid) {

                                order = await fetchOrder(oid, sid);


                            }
                        }
                    }

                    // Aggiorna i dati dell'ordine
                    if (order) {
                        setOrderData(order);
                    } else {
                        console.error("Nessun ordine trovato.");
                    }
                } catch (error) {
                    console.error("Errore durante il caricamento dell'ordine:", error);
                } finally {
                    setLoading(false);
                }
            }

            loadOrder();
        }
    }, [route.params, sid]);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!orderData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Non ci sono dettagli dell'ordine disponibili. Effettua un acquisto per visualizzarlo.</Text>
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Dettagli dell'Ordine</Text>
                <Text style={styles.label}>ID Ordine:</Text>
                <Text style={styles.value}>{orderData.oid}</Text>
                <Text style={styles.label}>Stato:</Text>
                <Text style={styles.value}>{orderData.status}</Text>
                <Text style={styles.label}>Creazione:</Text>
                <Text style={styles.value}>{new Date(orderData.creationTimestamp).toLocaleString()}</Text>
                <Text style={styles.label}>Tempo di consegna:</Text>
                <Text style={styles.value}>{new Date(orderData.deliveryTimestamp).toLocaleString()}</Text>
            </View>
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>Mappa (in arrivo...)</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f8f8',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        padding: 16,
    },
    mapText: {
        fontSize: 16,
        color: '#888',
    },
});

export default Order;
