<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatDate, handleError, sleep } from "@renderer/helpers/form-helpers";
import { useSurveiStore } from "@renderer/stores/survei";
import "survey-core/defaultV2.min.css";
import { Model } from 'survey-core';
import { alertLoading, alertSuccess } from "@renderer/helpers/alert-helpers";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const store = useSurveiStore();

const survei = ref({ base: null, instance: null });

const handleComplete = async (sender) => {
    alertLoading();

    const { nama_responden, alamat, nik, ttd } = sender.data;
    const others = sender.data;

    const results = JSON.stringify(sender.data);

    const payload = {
        parent: survei.value.base.id, nama: nama_responden, alamat, nik, hasil: JSON.stringify(others)
    };

    const form = new FormData();

    for (const [key, value] of Object.entries(payload)) {
        form.append(key, value);
    }

    try {
        const response = await axios.post('/dashboard/survei/api/v1/responden/', form, { headers: { 'Content-Type': 'multipart/form-data' }});
        console.log(response);
        alertSuccess('Berhasil', 'Data pengisian telah <b>berhasil</b> disimpan!')
    } catch (e) {
        handleError(e);
    }
};

onMounted(() => {
    store.surveys.filter(item => {
        if (item.id == route.params.id) {
            survei.value.base = item;

            survei.value.instance = new Model(item.parent.daftar_pertanyaan);
            survei.value.instance.onComplete.add(handleComplete);
        };
    });
})

</script>

<template>
    <template v-if="survei.instance">
        <div class="row pb-2 mt-3 border-bottom">
            <div class="mb-3 col-lg-9">
                <h4>Pengisian Survei - <br><b>{{ survei.base.parent.nama }}</b> <b>({{ survei.base.parent.kode }})</b>
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
                            <td>{{ survei.base.parent.nama }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Lokasi</td>
                            <td>{{ survei.base.wilayah }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Tanggal Wawancara</td>
                            <td>{{ formatDate(survei.base.tanggal_wawancara) }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-success text-white">Waktu</td>
                            <td>{{ survei.base.waktu_mulai }} - {{ survei.base.waktu_akhir }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">Nama Petugas</td>
                            <td>{{ survei.base.nama_petugas }}</td>
                        </tr>
                        <tr>
                            <td class="fw-bold ps-3 bg-primary text-white">NIK Petugas</td>
                            <td>{{ survei.base.nik_petugas }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="p-3">
            <SurveyComponent :model="survei.instance" />
        </div>
    </template>
</template>
