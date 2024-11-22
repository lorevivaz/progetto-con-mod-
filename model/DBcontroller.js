// importa sqlite 
import * as SQLite from 'expo-sqlite';

// crea la classe DBcontroller

class DBcontroller {
    constructor(){
        this.db = null;
    }

    async openDB() {
        this.db =  await SQLite.openDatabaseSync('mangiaDB');
        const query = "CREATE TABLE IF NOT EXISTS Menu (mid INTEGER PRIMARY KEY , imageversion INTEGER, bas64 TEXT )";
        await this.db.execAsync(query);    
    
       }


    // devo creare una funzione per inserire un'immagine nel db 
    async insertMenuImage(mid, imageVersion, base64) {
        // devo prendere i dati dal comunications controller ossia getmenuimage e getmenu 

        const query = "INSERT INTO Menu (mid, imageversion, base64) VALUES (?, ?, ?)";
        await this.db.execAsync(query, [mid, imageVersion, base64]);


    }


    

}

export default new DBcontroller();




