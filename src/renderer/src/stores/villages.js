import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { db } from "@renderer/utils/db";

export const useVillageStore = defineStore("village", () => {
    const getData = async () => {
        const storedData = await db.villages.toArray();
		if (storedData) return storedData;

		return [];
    };

	const setData = async (value) => {
		villages.value = value;

		await db.villages.clear();
		await db.villages.add({ data: value });
	};

    const villages = ref([]);

	getData().then((data) => {
        villages.value = data || [];
    });


    return { villages, setData };
});
