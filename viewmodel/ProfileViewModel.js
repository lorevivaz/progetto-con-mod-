import CommunicationController from "../model/ComunicationController";

export async function fetchData(sid, uid) {
  try {
    return CommunicationController.getUser(sid, uid);
  } catch (error) {
    console.error("error during get object date request", error);
  }
}

export async function updateUserData(sid, uid, user) {
  try {
    console.log("utente è : ", user.firstName, user.lastName);

    return await CommunicationController.putUser(sid, uid, user);
  } catch (error) {
    console.error("Error during PUT request:", error);
  }
}

export async function isCardValid(sid, uid) {
  try {
    const user = await fetchData(sid, uid);
    if (user && user.cardNumber && user.cardExpireMonth && user.cardExpireYear && user.cardCVV) {
      // Aggiungi ulteriori controlli di validità della carta se necessario
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Errore durante la verifica della validità della carta:", error);
    return false;
  }
}
