// Home.js 
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMenu, fetchImage } from "../viewmodel/HomeViewModel";

export default function Home({ navigation }) {
    
    const [menuData, setMenuData] = useState([]);
    const [sid, setSid] = useState(null);
    const [uid, setUid] = useState(null);

    useEffect(() => {
        AsyncStorage.getItem('user').then((user) => {
            const parsedUser = JSON.parse(user);
            const sid = parsedUser.sid;
            const uid = parsedUser.uid;
            setSid(sid);
            setUid(uid);
        });
    }, []);
    
    
    useEffect(() => {
        if (sid && uid) {
            async function loadMenu() {
                try {
                    const db = await SQLite.openDatabaseSync("MangiaBasta");
                    console.log("Database opened successfully.");
                    await db.execAsync(`
                        CREATE TABLE IF NOT EXISTS MENU (
                            mid INTEGER PRIMARY KEY NOT NULL, 
                            imgversion INTEGER NOT NULL, 
                            base64 TEXT
                        );
                    `);
                    const menu =await fetchMenu(sid);
                    const menuWithImages = await Promise.all(menu.map(async(item) => {
                        const imgQuery = `
                            SELECT base64 FROM MENU WHERE mid = ? AND imgversion = ?;
                        `;
                        let menuImage = await db.getFirstAsync(imgQuery, [item.mid, item.imageVersion]);
                        //console.log("immagine: ", menuImage);
                        if (menuImage==null) {
                            menuImage = await fetchImage(sid, item.mid);
                            console.log("immagine: ", menuImage);
                            await db.runAsync(
                                "REPLACE INTO MENU (mid, imgversion, base64) VALUES (?, ?, ?);",
                                [item.mid, item.imageVersion, menuImage]
                            );
                            console.log("Data replaced successfully.");
                        } else {
                            menuImage = menuImage.base64;
                        }
                        //console.log("immagine: ", menuImage);
                        return {
                            ... item,
                            menuImage: menuImage!==-1 ? menuImage:null,
                        }
                    }));
                    setMenuData(menuWithImages)
                } catch (error) {
                    console.log("Error: " + error.message);
                }
            }
            loadMenu();
        }
    }, [sid, uid]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('MenuDetails', { menu: { sid : sid, mid: item.mid, location: item.location } })}
        >
            {item.menuImage && <Image source={{ uri: item.menuImage }} style={styles.menuImage} />}
            <View style={styles.cardContent}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuDescription}>{item.shortDescription}</Text>
                <Text style={styles.menuPrice}>Price: {item.price}€</Text>
                <Text style={styles.menuDelivery}>Delivery Time: {item.deliveryTime} min</Text>
                <Text style={styles.menuLocation}>Location: {item.location.lat}, {item.location.lng}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={menuData}
                renderItem={renderItem}
                keyExtractor={(item) => item.mid.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    listContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
        marginVertical: 10,
        overflow: 'hidden',
    },
    menuImage: {
        width: '100%',
        height: 150,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    cardContent: {
        padding: 12,
    },
    menuName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    menuDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    menuPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff6347', // colore caldo per il prezzo
        marginBottom: 4,
    },
    menuDelivery: {
        fontSize: 14,
        color: '#333',
        marginBottom: 4,
    },
    menuLocation: {
        fontSize: 12,
        color: '#999',
    },
});