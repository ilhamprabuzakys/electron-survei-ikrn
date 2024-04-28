import "./assets/base.css";
import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import PrimeVue from 'primevue/config';

import axios from "axios";
import { surveyPlugin } from 'survey-vue3-ui'
import vSelect from 'vue-select'

import App from "./App.vue";
import router from "./router";

import 'vue-select/dist/vue-select.css';

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";

axios.defaults.baseURL = 'http://103.210.54.17:8003';
const app = createApp(App);

app.use(createPinia());
app.use(surveyPlugin);
app.use(router);
app.use(PrimeVue);
app.component('v-select', vSelect);

app.mount("#app");

import "bootstrap/dist/js/bootstrap.js";
