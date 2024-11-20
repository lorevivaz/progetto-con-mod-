class CommunicationController {
    
    static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

    //posizione hardcoded, da implementare con la posizione reale
    static lat = 45.4642;
    static lng = 9.19;


    static async genericRequest(endpoint, verb, queryParams , bodyParams ) {
        const queryParamsFormatted = new URLSearchParams(queryParams).toString();
        const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
        //console.log("sending " + verb + " request to: " + url);
        let fatchData = {
            method: verb,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        };
        if (verb != 'GET') {
            fatchData.body = JSON.stringify(bodyParams);
        }
        let httpResponse = await fetch(url, fatchData);

        const status = httpResponse.status;
        if (status == 200) {
            let deserializedObject = await httpResponse.json();
            //console.log("Response: " + JSON.stringify(deserializedObject));
            return deserializedObject;
        } else if (status === 204) {
            // Gestiamo la risposta 204 No Content
            console.log("Request succeeded, no content returned.");
            return {};
        } else {
            //console.log(httpResponse);
            const message = await httpResponse.text();
            let error = new Error("Error message from the server. HTTP status: " + status + " " + message);
            throw error;
        }
    }

    static async register() {
        let endpoint = "user/";
        let verb = 'POST';
        let queryParams = {};
        let bodyParams = {};
        return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
    }

    static async getUser(sid, uid){

        let endpoint = "user/" + uid ;
        let verb = 'GET';
        let queryParams = {sid : sid};
        let bodyParams = {};
        console.log("getUser called with endpoint :", endpoint, " and queryParams: ", queryParams);

        return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
    }


    static async getMenu(sid){
        let endpoint = "menu/";
        let verb = 'GET';
        let queryParams = { lat: this.lat, lng: this.lng, sid: sid };
        let bodyParams = {};

        console.log("getMenu called with endpoint:", endpoint, "and queryParams:", queryParams);

        return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
    }

    static async getMenuImage (sid, mid) {
        let endpoint = "menu/" + mid + "/image";
        let verb = 'GET';
        let queryParams = {sid : sid};
        let bodyParams = {};

       // console.log("getMenuImage called with endpoint:", endpoint, "and queryParams:", queryParams);

        const response = await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        // console.log("Risposta getMenuImage:", response);

        // Controlla se la risposta contiene un'immagine in base64
        if (response.base64) {
            let base64Image = response.base64;
            return base64Image; 
        } else {
            return -1;
        }

    }

    static async getMenuDetails(sid, mid ) {
        let endpoint = "menu/" + mid;
        let verb = 'GET';
    
        let queryParams = {
            sid: sid, 
            lat: this.lat,  // Latitudine predefinita
            lng: this.lng,     // Longitudine predefinita
        };
        let bodyParams = {};
        
        // Log per verificare i parametri passati
        console.log("getMenuDetails called with endpoint:", endpoint, "and queryParams:", queryParams);
        
        // Chiamata alla funzione genericRequest
        try {
            return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
        } catch (error) {
            console.error("Errore durante la richiesta:", error);
            throw error;
        }
    }
    


    static async putUser(sid, uid, user) {

        let endpoint = "user/" + uid; // Rimuoviamo 'sid' dalla query string
        const verb = 'PUT';
        const queryParams = {};
        let bodyParams = { 

            firstName: user.firstName, 
            lastName: user.lastName, 
            cardFullName : user.cardFullName ,
            cardNumber : user.cardNumber ,
            cardExpireMonth : user.cardExpireMonth ,
            cardExpireYear : user.cardExpireYear ,
            cardCVV : user.cardCVV ,
            sid: sid ,

           
             };  // Costruiamo il body della richiesta con i dati dell'utente 
    
        console.log("putUser chiamato con endpoint:", endpoint, "e bodyParams:", bodyParams);

        return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
    }

}


export default CommunicationController;