import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchBuy, fetchOrder } from "../viewmodel/HomeViewModel";
import { isCardValid } from "../viewmodel/ProfileViewModel";

export async function handleBuy(menu, location, navigation, sid) {
  try {
    // Recupera l'ultimo ordine salvato
    const lastOrder = await AsyncStorage.getItem("lastOrder");

    // Verifica la validità della carta
    const user = await AsyncStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    const uid = parsedUser.uid;
    const sid = parsedUser.sid;

    const cardValid = await isCardValid(sid, uid);
    if (!cardValid) {
      alert(
        "Per favore, aggiorna i dettagli della tua carta prima di procedere con l'acquisto."
      );
      navigation.navigate("Profilo");
      return;
    }

    if (lastOrder) {
      const parsedOrder = JSON.parse(lastOrder);

      // Controlla lo stato dell'ordine salvato
      const existingOrder = await fetchOrder(parsedOrder.oid, sid);

      if (existingOrder && existingOrder.status !== "COMPLETED") {
        alert(
          "Hai già un ordine attivo. Aspetta che l’ordine esistente arrivi."
        );
        return;
      } else if (existingOrder && existingOrder.status === "COMPLETED") {
        // Cancella l'ordine esistente
        await AsyncStorage.removeItem("lastOrder");
      }
    }

    // Effettua l'acquisto se non ci sono ordini attivi
    const response = await fetchBuy(
      menu.mid,
      sid,
      location.latitude,
      location.longitude
    );
    console.log("Acquisto effettuato con successo:", response);

    // Salva il nuovo ordine
    await AsyncStorage.setItem(
      "lastOrder",
      JSON.stringify({ oid: response.oid, mid: menu.mid })
    );

    console.log("Location:", location);

    // Naviga alla schermata Order.js
    navigation.navigate("Ordini", { order: response });

    alert("Acquisto completato con successo!");
  } catch (error) {
    console.error("Errore durante l'acquisto del menu:", error);
    alert("Errore durante l’acquisto. Riprova.");
  }
}