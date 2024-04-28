import { ref, computed, onMounted } from "vue";
import { defineStore } from "pinia";
import { db } from "@renderer/utils/db";

export const useSurveiStore = defineStore("survei", () => {
	const getData = (key) => {
		const storedData = JSON.parse(localStorage.getItem(key));

		if (storedData) return storedData;

		return [];
	}

	const setLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

    const setDataSumber = (value) => {
        sumber.value = value;
		setLocalStorage('sumber', value);
    };

	const setDataSurveys = (value) => {
        surveys.value = value;
		setLocalStorage('surveys', value);
    };

	const sumber = ref(getData('sumber'));
	const surveys = ref(getData('surveys'));

    return { sumber, surveys, setDataSumber, setDataSurveys };
});
