class CommunicationController {
  static BASE_URL = "https://develop.ewlab.di.unimi.it/mc/2425/";

  //posizione hardcoded, da implementare con la posizione reale

  static async genericRequest(endpoint, verb, queryParams, bodyParams) {
    const queryParamsFormatted = new URLSearchParams(queryParams).toString();
    const url = this.BASE_URL + endpoint + "?" + queryParamsFormatted;
    //console.log("sending " + verb + " request to: " + url);
    let fatchData = {
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (verb != "GET") {
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
      let error = new Error(
        "Error message from the server. HTTP status: " + status + " " + message
      );
      throw error;
    }
  }

  static async register() {
    let endpoint = "user/";
    let verb = "POST";
    let queryParams = {};
    let bodyParams = {};
    return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
  }

  static async getUser(sid, uid) {
    let endpoint = "user/" + uid;
    let verb = "GET";
    let queryParams = { sid: sid };
    let bodyParams = {};
    console.log(
      "getUser called with endpoint :",
      endpoint,
      " and queryParams: ",
      queryParams
    );

    return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
  }

  static async getMenu(lat, lng, sid) {
    let endpoint = "menu/";
    let verb = "GET";
    let queryParams = { lat: lat, lng: lng, sid: sid };
    let bodyParams = {};

    // console.log("getMenu called with endpoint:", endpoint, "and queryParams:", queryParams);

    return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
  }

  static async getMenuImage(sid, mid) {
    let endpoint = "menu/" + mid + "/image";
    let verb = "GET";
    let queryParams = { sid: sid };
    let bodyParams = {};

    // console.log("getMenuImage called with endpoint:", endpoint, "and queryParams:", queryParams);

    const response = await this.genericRequest(
      endpoint,
      verb,
      queryParams,
      bodyParams
    );
    // console.log("Risposta getMenuImage:", response);

    // Controlla se la risposta contiene un'immagine in base64
    if (response.base64) {
      let base64Image = response.base64;
      return base64Image;
    } else {
      return -1;
    }
  }

  static async getMenuDetails(sid, mid, lat, lng) {
    let endpoint = "menu/" + mid;
    let verb = "GET";

    let queryParams = {
      sid: sid,
      lat: lat, // Latitudine predefinita
      lng: lng, // Longitudine predefinita
    };
    let bodyParams = {};

    // Log per verificare i parametri passati
    console.log(
      "getMenuDetails called with endpoint:",
      endpoint,
      "and queryParams:",
      queryParams
    );

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
    const verb = "PUT";
    const queryParams = {};
    let bodyParams = {
      firstName: user.firstName,
      lastName: user.lastName,
      cardFullName: user.cardFullName,
      cardNumber: user.cardNumber,
      cardExpireMonth: user.cardExpireMonth,
      cardExpireYear: user.cardExpireYear,
      cardCVV: user.cardCVV,
      sid: sid,
    }; // Costruiamo il body della richiesta con i dati dell'utente

    console.log(
      "putUser chiamato con endpoint:",
      endpoint,
      "e bodyParams:",
      bodyParams
    );

    return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
  }

  static async buyMenu(mid, sid, lat, lng) {
    const endpoint = "menu/" + mid + "/buy";
    const verb = "POST";

    const queryParams = {}; // In questo caso, non ci sono query parameters
    const bodyParams = {
      sid: sid,
      deliveryLocation: {
        lat: lat,
        lng: lng,
      },
    };

    console.log(
      "buyMenu called with endpoint:",
      endpoint,
      "and bodyParams:",
      bodyParams
    );

    try {
      // Esegui la richiesta generica
      const response = await this.genericRequest(
        endpoint,
        verb,
        queryParams,
        bodyParams
      );
      return response; // Restituisce la risposta del server
    } catch (error) {
      console.error("Errore durante l'acquisto del menu:", error);
      throw error; // Rilancia l'errore per la gestione a livello superiore
    }
  }

  static async getOrders(oid, sid) {
    let endpoint = "order/" + oid; // oid è parte del percorso
    let verb = "GET";
    let queryParams = { sid: sid };
    let bodyParams = {}; // GET non richiede body

    console.log(
      "getOrders chiamato con endpoint:",
      endpoint,
      " e queryParams: ",
      queryParams
    );

    return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
  }

  static async DeleteOrder(sid) {
    let endpoint = "order/";
    let verb = "DELETE";
    let queryParams = { sid: sid };
    let bodyParams = {};

    console.log(
      "DeleteOrder chiamato con endpoint:",
      endpoint,
      " e queryParams: ",
      queryParams
    );

    return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
  }

  static async getIngredients(sid, mid) {
    let endpoint = "menu/" + mid + "/ingredients";
    let verb = "GET";
    let queryParams = { sid: sid };
    let bodyParams = {};

    console.log(
      "getIngredients chiamato con endpoint:",
      endpoint,
      " e queryParams: ",
      queryParams
    );

    try {
      return await this.genericRequest(endpoint, verb, queryParams, bodyParams);
    }
    catch (error) {
      console.error("Errore durante la fetchIngredients:", error);
      throw error; // Rilancia l'errore per gestirlo altrove
    }
    
  }
}

export default CommunicationController;
