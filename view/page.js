import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { fetchIngredients } from "../viewmodel/HomeViewModel";

export default function Page({ route, navigation }) {
  const { menu } = route.params; // Estrarre "menu" da route.params
  const { sid } = route.params; // Estrarre "sid" da route.params

  const [ingredients, setIngredients] = useState([]); // Array vuoto per gli ingredienti
  const [filteredIngredients, setFilteredIngredients] = useState([]); // Array per gli ingredienti filtrati
  const [showBio, setShowBio] = useState(false); // Stato per il filtro biologico

  // chiamata dentro un useEffect per recuperare la lista degli ingredienti di un menu
  useEffect(() => {
    if (sid && menu.mid) { // Se sid e menu.mid sono definiti
      async function loadIngredients() {
        try {
          const response = await fetchIngredients(sid, menu.mid); // Chiamata a fetchIngredients
          setIngredients(response); // Imposta la risposta come stato
          setFilteredIngredients(response); // Imposta la risposta come stato filtrato iniziale
        } catch (error) {
          console.error("Errore durante il recupero degli ingredienti:", error);
        }
      }

      loadIngredients(); // Chiamata alla funzione per caricare gli ingredienti
    }
  }, [sid, menu.mid]); // Dipendenze per eseguire l'effetto solo quando sid o menu.mid cambiano

  // Funzione per filtrare gli ingredienti biologici
  const filterBio = () => {
    setShowBio(!showBio);
    if (!showBio) {
      setFilteredIngredients(ingredients.filter(item => item.bio));
    } else {
      setFilteredIngredients(ingredients);
    }
  };

  // Funzione per renderizzare ogni ingrediente
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <Text style={styles.itemBio}>{item.bio ? "Biologico" : "Non biologico"}</Text>
      <Text style={styles.itemOrigin}>{item.origin}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={filterBio} style={styles.bioButton}>
        <Text style={styles.bioButtonText}>BIO</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Ingredienti del Menu</Text>
      <FlatList
        data={filteredIngredients}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.button}>
        <Text style={styles.buttonText}>Torna alla Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  bioButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  bioButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 16,
  },
  item: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  itemBio: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  itemOrigin: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#ff6f00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});