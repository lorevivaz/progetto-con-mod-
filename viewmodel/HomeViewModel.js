// questo è il viewmodel che si occupa di recuperare i dati dal modello e passarli alla view

import CommunicationController from "../model/ComunicationController";

export async function fetchMenu(lat, lng, sid) {
    try {
        return await CommunicationController.getMenu(lat , lng, sid);
    } catch (error) {
        console.error("Error during GET request:", error);
    }
}


// funzione che mi recupera l'immagine del menu 
export async function fetchImage(sid, mid) {
    try {
        const menuImage = await CommunicationController.getMenuImage(sid, mid);
        return 'data:image/jpeg;base64,' + menuImage; // Restituisce l'immagine del menu
    } catch (error) {
        console.error("Errore durante il recupero dell'immagine del menu:", error);
        throw new Error("Errore durante il recupero dell'immagine del menu");
    }
}

// Funzione per recuperare i dettagli di un menu
export async function fetchMenuDetails(sid, mid, lat, lng) {
   
    try {
        const menuDetails = await CommunicationController.getMenuDetails(sid, mid, lat, lng);
        return menuDetails;
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli del menu:", error);
        throw new Error("Errore durante il recupero dei dettagli del menu");
    }



}
// funzione che crea un ordine dopo aver selezionato un menu 
export async function fetchBuy(mid, sid , lat, lng) {
    try {
        const response = await CommunicationController.buyMenu(mid, sid, lat, lng);
        if (response) {
            console.log("Acquisto effettuato con successo:", response);
            return response; // Restituisce i dettagli dell'ordine
        } else {
            throw new Error("La risposta della chiamata è vuota.");
        }
    } catch (error) {
        console.error("Errore durante la fetchBuy:", error);
        throw error; // Rilancia l'errore per gestirlo altrove
    }
}


export async function fetchOrder (oid ,sid ) {
    try {
        const response = await CommunicationController.getOrders(oid, sid);
        if (response) {
            console.log("Ordine recuperato con successo:", response);
            return response; // Restituisce i dettagli dell'ordine
        } else {
            throw new Error("La risposta della chiamata è vuota.");
        }
    } catch (error) {
        console.error("Errore durante la fetchOrder:", error);
        throw error; // Rilancia l'errore per gestirlo altrove
    }
}