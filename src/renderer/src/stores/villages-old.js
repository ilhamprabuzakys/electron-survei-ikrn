import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";

const DB_NAME = "MainDB";
const DB_VERSION = 1;
const STORE_NAME = "villages";

export const useVillageStore = defineStore("village", () => {
    const db = new Promise((resolve, reject) => {
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = (event) => {
            console.error("IndexedDB error:", event.target.error);
            reject(event.target.error);
        };

        request.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        };

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            store.createIndex("name", "name", { unique: false });
        };
    });

    const getData = async () => {
        const database = await db;
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(STORE_NAME, "readonly");
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onerror = (event) => {
                console.error("Error getting data from IndexedDB:", event.target.error);
				villages.value = [];
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                const data = event.target.result;
				villages.value = data;
                resolve(data);
            };
        });
    };

    const villages = ref([]);

	getData().then((data) => {
        villages.value = data || [];
    });

    const setData = async (value) => {
        console.log("Setting data with new data as :", value);
        const database = await db;
        console.log('DB', database);
        return new Promise((resolve, reject) => {
            const transaction = database.transaction(STORE_NAME, "readwrite");
            const store = transaction.objectStore(STORE_NAME);
            const clearRequest = store.clear();
            clearRequest.onsuccess = () => {
                const addRequest = store.add(value);
                addRequest.onerror = (event) => {
                    console.error("Error adding data to IndexedDB:", event.target.error);
                    reject(event.target.error);
                };
                addRequest.onsuccess = () => {
                    console.log('success')
                    resolve();
                };
            };
        });
    };

    return { villages, setData };
});
