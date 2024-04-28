<script setup>
import { handleError, onMounted, ref } from "vue";
import 'tabulator-tables/dist/css/tabulator.min.css';
import 'survey-analytics/survey.analytics.tabulator.min.css';
import { Model } from 'survey-core';
import { Tabulator } from 'survey-analytics/survey.analytics.tabulator';
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { formatDate, sleep } from "@renderer/helpers/form-helpers";
import { alertClose, alertLoading } from "@renderer/helpers/alert-helpers";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from 'xlsx';

const route = useRoute();
const router = useRouter();

const dataResponden = ref(null);
const tipeSurvei = ref(null);
const parentSurvei = ref(null);

// window.jsPDF = jsPDF;
window.XLSX = XLSX;

const fetchData = async (id) => {
    try {
        const response = await axios.get(`/dashboard/survei/api/v1/responden/${id}/`);
        const data = response.data;
        dataResponden.value = data;

        await fetchDataParent(data.parent);
    } catch (e) {
        handleError(e);
    }
};

const fetchDataParent = async (id) => {
    try {
        const response = await axios.get(`/dashboard/survei/api/v1/data/${id}/`);
        const data = response.data;
        tipeSurvei.value = data;
        parentSurvei.value = data.parent;
    } catch (e) {
        handleError(e);
    }
};

const generateData = () => {
    const data = [];
    const result = dataResponden.value.hasil;
    const obj = {};
    for (let key in result) {
        if (result.hasOwnProperty(key)) {
            obj[key] = result[key];
        }
    }
    data.push(obj);
    return data;
};

onMounted(async () => {
    alertLoading();

    await fetchData(route.params.id);

    console.log(dataResponden.value)

    const survey = new Model(parentSurvei.value.daftar_pertanyaan);
    const surveyTable = new Tabulator(survey, generateData());
    surveyTable.render("surveyResultTable");

    alertClose();

});

</script>
<template>
    <div v-if="tipeSurvei">
        <div class="row pb-2 mt-3 border-bottom">
            <div class="mb-3 col-lg-9">
                <h4>Hasil Pengisian Survei Responden - <br><b>{{ tipeSurvei?.parent.nama }}</b>
                    <b>({{ tipeSurvei?.parent.kode }})</b>
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
                            <td>{{ tipeSurvei?.parent.nama }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Lokasi</td>
                            <td>{{ tipeSurvei.wilayah }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Tanggal Wawancara</td>
                            <td>{{ formatDate(tipeSurvei.tanggal_wawancara) }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Waktu</td>
                            <td>{{ tipeSurvei.waktu_mulai }} - {{ tipeSurvei.waktu_akhir }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">Nama Responden</td>
                            <td>{{ dataResponden.nama }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">NIK Responden</td>
                            <td>{{ dataResponden.nik }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">Alamat Responden</td>
                            <td>{{ dataResponden.alamat }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">TTD Responden</td>
                            <td>
                                <div class="p-3">
                                    <img :src="dataResponden.hasil.ttd" class="img-fluid img-thumbnail" alt="ttd" />
                                </div>
                            </td>
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
