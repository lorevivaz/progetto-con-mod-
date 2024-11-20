//classe che gestisce l'apertura di un db e la creazione di tabelle
// voglio salvare al suo interno i dati relativi ai menu
// e ai dettagli di un menu

//importo la libreria sqlite
import * as SQLite from 'expo-sqlite';
//importo il controller delle comunicazioni
import CommunicationController from './ComunicationController';


export async function dbSetUp(sid, menu) {

  //creo un db
const db = SQLite.openDatabase('menu.db');



//creo la tabella menu
const createTableMenudetails = `
CREATE TABLE IF NOT EXISTS Menu (
    sid INTEGER NOT NULL,
    mid INTEGER NOT NULL,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    lat DECIMAL(5, 2) NOT NULL,
    lng DECIMAL(5, 2) NOT NULL,
    imageVersion INTEGER NOT NULL,
    shortDescription TEXT NOT NULL,
    deliveryTime INTEGER NOT NULL,
    longDescription TEXT NOT NULL,
    PRIMARY KEY (sid, mid)
);`;

// crea la tabella se non esiste
await db.transaction(async (tx) => {
    await tx.executeSql(createTableMenudetails);
}).catch((error) => {
    console.error("Errore durante la creazione della tabella Menu:", error);
});
}

const imageversioneQuery = `
SELECT imageVersion FROM Menu WHERE sid = ? AND mid = ?;
`;

await db.transactionAsync(async (tx) => {
    const getDBimageVersion = await tx.executeSqlAsync(imageversioneQuery, [sid, menu.mid]);
    const DBMenuVersion = getDBimageVersion.rows.item(0).imageVersion;
    const updatedMenu = await CommunicationController.getMenuDetails(sid, menu.mid);

    if (updatedMenu.imageVersion > DBMenuVersion) {
        const updateMenu = `
        UPDATE Menu SET name = ?, price = ?, lat = ?, lng = ?, imageVersion = ?, shortDescription = ?, deliveryTime = ?, longDescription = ? WHERE sid = ? AND mid = ?;
        `;

        await db.transaction(async (tx) => {
            await tx.executeSql(updateMenu, [
                updatedMenu.name,
                updatedMenu.price,
                updatedMenu.location.lat,
                updatedMenu.location.lng,
                updatedMenu.imageVersion,
                updatedMenu.shortDescription,
                updatedMenu.deliveryTime,
                updatedMenu.longDescription,
                sid,
                menu.mid,
            ]);
        }).catch((error) => {
            console.error("Errore durante l'aggiornamento del menu:", error);
        });
    }
});




