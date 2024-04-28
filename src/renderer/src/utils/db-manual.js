const DB_NAME = "MainDB";
const DB_VERSION = 1;
const STORE_NAME = "villages";

const getDB = () => {
	return new Promise((resolve, reject) => {
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
}