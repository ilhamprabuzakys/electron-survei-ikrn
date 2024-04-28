<script setup>
import { handleError, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import 'tabulator-tables/dist/css/tabulator.min.css';
import 'survey-analytics/survey.analytics.tabulator.min.css';
import { Model } from 'survey-core';
import { Tabulator } from 'survey-analytics/survey.analytics.tabulator';
import axios from "axios";
import { formatDate, sleep } from "@renderer/helpers/form-helpers";
import { alertClose, alertLoading } from "@renderer/helpers/alert-helpers";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

const route = useRoute();
const router = useRouter();

const dataResponden = ref(null);
const dataSurvei = ref(null);

// window.jsPDF = jsPDF;
window.XLSX = XLSX;

const fetchDataResponden = async (id) => {
    try {
        const response = await axios.get(`/dashboard/survei/api/v1/responden/?parent=${id}`);
        const data = response.data;
        dataResponden.value = data;
    } catch (e) {
        handleError(e);
    }
};

const fetchData = async (id) => {
    try {
        const response = await axios.get(`/dashboard/survei/api/v1/data/${id}/`);
        const data = response.data;
        dataSurvei.value = data;
        await fetchDataResponden(data.id);
    } catch (e) {
        handleError(e);
    }
};

const generateData = () => {
    const data = [];
    const result = dataResponden.value;

    for (let item of result) {
        const hasil = item.hasil;
        const obj = {};
        for (let key in hasil) {
            if (hasil.hasOwnProperty(key)) {
                obj[key] = hasil[key];
            }
        }
        data.push(obj);
    }
    return data;
};

onMounted(async () => {
    alertLoading();

    await fetchData(route.params.id);

    const surveyInstance = new Model(dataSurvei.value.parent.daftar_pertanyaan);
    const surveyTable = new Tabulator(surveyInstance, generateData());

    surveyTable.render("surveyResultTable");

    alertClose();
});
</script>

<template>
    <div v-if="dataSurvei">
        <div class="row pb-2 mt-3 border-bottom">
            <div class="mb-3 col-lg-9">
                <h4>Hasil Pengisian Survei - <br><b>{{ dataSurvei.parent.nama }}</b>
                    <b>({{ dataSurvei.parent.kode }})</b>
                </h4>
            </div>
            <div class="mb-3 col-lg-3 d-flex justify-content-end align-items-center">
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-4" @click="(() => router.push('/'))">
                        <i class="fas fa-arrow-left me-2"></i>
                        Kembali
                    </button>
                </div>
            </div>
            <div class="mb-3 col-lg-12">
                <table class="table table-bordered table-sm">
                    <tbody>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Judul Survei</td>
                            <td>{{ dataSurvei.parent.nama }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Lokasi</td>
                            <td>{{ dataSurvei.wilayah }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Tanggal Wawancara</td>
                            <td>{{ formatDate(dataSurvei.tanggal_wawancara) }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Waktu</td>
                            <td>{{ dataSurvei.waktu_mulai }} - {{ dataSurvei.waktu_akhir }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">Nama Petugas</td>
                            <td>{{ dataSurvei.nama_petugas }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">NIK Petugas</td>
                            <td>{{ dataSurvei.nik_petugas }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="mt-3">
            <div id="surveyResultTable"></div>
        </div>
    </div>
</template>
