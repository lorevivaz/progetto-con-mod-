import CommunicationController from "./ComunicationController.js";



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
