import CommunicationController from "../app/model/ComunicationController";

export async function fetchMenu(sid) {
    try {
        return await CommunicationController.getMenu(sid);
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