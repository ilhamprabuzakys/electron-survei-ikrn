<script setup>
import { onMounted, ref } from "vue";
import { useSurveiStore } from "@renderer/stores/survei";
import { dt_lang_config, formatDate, getToday, handleError, sleep } from "@renderer/helpers/form-helpers";
import axios from "axios";
import { alertConfirm, alertLoading, alertSuccess, hideModal, showModal } from "@renderer/helpers/alert-helpers";
import InputMask from 'primevue/inputmask';
import _ from "lodash";

import "survey-core/defaultV2.min.css";
import { Model } from 'survey-core';

import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

import Heading from "@renderer/components/Heading.vue";
import ModalDialog from "@renderer/components/ModalDialog.vue";

DataTable.use(DataTablesCore);

const store = useSurveiStore();
const villages = ref([]);

const formSchema = { parent: '', lokasi: '' };
const form = ref({...formSchema});
const survei = ref({ base: null, instance: null });

const fetchData = async () => {
    try {
        const response = await axios.get('/dashboard/survei/api/v1/data/');
        store.setDataSurveys(response.data.results);
    } catch (e) {
        handleError(e);
    }
}

const handleSearchWilayah = _.throttle(async (search, loading) => {
    try {
        loading(true);
        const response = await axios.get(`/dashboard/masters/api/v1/daftar_desa/?s=${search}`);
        villages.value = response.data.results;
    } catch (e) {
        console.error(e);
    } finally {
        loading(false);
    }
}, 2000);

const alertResults = (sender) => {
    const results = JSON.stringify(sender.data);
    alert(results);
};

const handlePreview = (data) => {
    survei.value.base = data;
    survei.value.instance = new Model(data.parent.daftar_pertanyaan);
    survei.value.instance.onComplete.add(alertResults);
};

const handleDelete = async (id) => {
    const confirmation = await alertConfirm(`Apakah anda yakin ingin <b>menghapus</b> data ini? <br>Data yang dihapus tidak dapat <b>dipulihkan</b> kembali!`);

    if (!confirmation.isConfirmed) return;

    alertLoading();

    await sleep(500);

    try {
        await axios.delete(`/dashboard/survei/api/v1/data/${id}/`);
        await fetchData();
        alertSuccess('Berhasil', `Data survei telah <b>berhasil</b> dihapus!`);
    } catch (e) {
        handleError(e);
    }
}

const handleSubmit = async () => {
    alertLoading();

    await sleep(500);

    if (form.value.id) {
        if (form.value.lokasi) {
            form.value.wilayah = form.value.lokasi.wilayah;
            form.value.nama_provinsi = form.value.lokasi.nama_provinsi;
            form.value.nama_kabupaten = form.value.lokasi.nama_kabupaten;
            form.value.nama_kecamatan = form.value.lokasi.nama_kecamatan;
            form.value.nama_desa = form.value.lokasi.nama_desa;

            form.value.provinsi = form.value.lokasi.provinsi;
            form.value.kabupaten = form.value.lokasi.kabupaten;
            form.value.kecamatan = form.value.lokasi.kecamatan;
            form.value.desa = form.value.lokasi.desa;
        }

        if (form.value.parent.id) {
            form.value.parent = form.value.parent.id;
        }
    } else {
        form.value.parent = form.value.parent.id;
        form.value.wilayah = form.value.lokasi.wilayah;
        form.value.nama_provinsi = form.value.lokasi.nama_provinsi;
        form.value.nama_kabupaten = form.value.lokasi.nama_kabupaten;
        form.value.nama_kecamatan = form.value.lokasi.nama_kecamatan;
        form.value.nama_desa = form.value.lokasi.nama_desa;

        form.value.provinsi = form.value.lokasi.provinsi;
        form.value.kabupaten = form.value.lokasi.kabupaten;
        form.value.kecamatan = form.value.lokasi.kecamatan;
        form.value.desa = form.value.lokasi.desa;
    }

    try {
        let message = '';

        if (form.value.id) {
            await axios.put(`/dashboard/survei/api/v1/data/${form.value.id}/`, form.value);
            message = `Data survei telah <b>berhasil</b> diperbarui!`;
        } else {
            await axios.post('/dashboard/survei/api/v1/data/', form.value);
            message = `Data survei telah <b>berhasil</b> ditambahkan!`;
        }

        await fetchData();

        alertSuccess('Berhasil', message);
        hideModal();
        form.value = {...formSchema};
    } catch (e) {
        handleError(e);
    }
}

const handleEdit = async (id) => {
    try {
        showModal('actionModal');
        const response = await axios.get(`/dashboard/survei/api/v1/data/${id}/`);
        const data = response.data
        form.value = data;
        handleSearchWilayah(data.nama_desa, ()=> {});
    } catch (e) {
        handleError(e);
    }
}

// DataTable
let dt;
const table = ref();

const columns = [
    { data: null, render: "#numbering", class: 'text-center', width: "5%" },
    { data: null, render: "#nama" },
    { data: 'wilayah', title: 'Lokasi' },
    {
        data: 'tanggal_wawancara', width: "10%",
        render: (data, type, row) => formatDate(data)
    },
    { data: 'id', render: "#action", width: "8%" },
];

const options = { language: dt_lang_config(), processing: true };

onMounted(async () => {
    dt = table.value.dt;
    await fetchData();
    // if (store.surveys.length === 0) await fetchData();
});
</script>

<template>

    <Heading title="Admin Daftar Survei">
        <template #action>
            <div>
                <button class="btn btn-success btn-sm" data-bs-toggle="modal" data-bs-target="#actionModal" @click="form = {...formSchema}">
                    <i class="fas fa-plus me-2"></i>
                    Tambah Data
                </button>
            </div>
        </template>
    </Heading>

    <div class="table-responsive small mt-3">
        <DataTable :data="store.surveys" :options="options" :columns="columns" class="table table-sm table-bordered" ref="table">
            <thead>
                <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Judul Survei</th>
                    <th scope="col">Lokasi</th>
                    <th scope="col">Tgl. Wawancara</th>
                    <th scope="col">Aksi <i class="fas fa-edit ms-2"></i></th>
                </tr>
            </thead>
            <template #nama="props">
                <span @click="handlePreview(props.rowData)" class="cursor-pointer h-underline">{{ props.rowData.parent?.nama }}</span>
            </template>
            <template #numbering="props">
                {{ props.rowIndex+1 }}
            </template>
            <template #action="props">
                <div class="list-button py-2">
                    <button type="button" class="badge bg-primary text-white" @click="handlePreview(props.rowData)">
                        <i class="fas fa-eye me-1"></i>
                        Lihat
                    </button>
                    <button type="button" class="badge bg-success text-white" @click="handleEdit(props.cellData)">
                        <i class="fas fa-edit me-1"></i>
                        Edit
                    </button>
                    <button type="button" class="badge bg-danger text-white" @click="handleDelete(props.cellData)">
                        <i class="fas fa-xmark me-1"></i>
                        Hapus
                    </button>
                </div>
            </template>
        </DataTable>
    </div>

    <template v-if="survei.instance">
        <transition>
            <div>
                <hr>
                <div class="row pb-2 mt-3 border-bottom">
                    <div class="mb-3 col-lg-9">
                        <h4><b>Pratinjau Survei</b></h4>
                    </div>
                    <div class="mb-3 col-lg-3 d-flex justify-content-end">
                        <div>
                            <button class="btn btn-sm btn-outline-danger me-4" @click="survei.instance = null">
                                <i class="fas fa-xmark me-2"></i>
                                Tutup
                            </button>
                        </div>
                    </div>
                    <div class="mb-3 col-lg-12">
                        <table class="table table-bordered table-sm">
                            <tbody>
                                <tr>
                                    <td class="fw-bold ps-3 bg-success text-white">Judul Survei</td>
                                    <td><b>{{ survei.base.parent.nama }}</b></td>
                                </tr>
                                <tr>
                                    <td class="fw-bold ps-3 bg-success text-white">Kode Survei</td>
                                    <td><b>{{ survei.base.parent.kode }}</b></td>
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
            </div>
        </transition>
    </template>

    <ModalDialog id="actionModal" :is-form="true" @submit="handleSubmit">
        <template #header>
            <b>{{ form.id ? 'Formulir Edit Survei' : 'Formulir Pengisian Survei' }}</b>
        </template>
        <template #body>
            <div class="mb-3">
                <label for="input__survei" class="form-label required">Pilih Sumber Survei :</label>
                <v-select id="input__survei" :options="store.sumber" v-model="form.parent" label="nama" placeholder="--Pilih sumber--" required>
                    <template #no-options>Data yang anda cari tidak ditemukan.</template>
                    <template #option="{ kode, nama }"><span><b>{{ kode }}</b> - {{ nama }}</span></template>
                </v-select>
            </div>

            <div class="mb-3">
                <label for="input__lokasi" class="form-label required">Lokasi :</label>

                <div class="my-3" v-show="form.id">
                    Data lokasi saat ini : <b>{{ form.wilayah }}</b>

                    <div class="mt-3 text-muted">
                        Kosongkan bagian ini jika <b>tidak</b> ingin mengganti lokasi
                    </div>
                </div>

                <v-select id="input__lokasi" :options="villages" v-model="form.lokasi" @search="handleSearchWilayah" label="wilayah" placeholder="--Pilih lokasi--" required>
                    <template #no-options>Data yang anda cari tidak ditemukan.</template>
                    <template #spinner="{ loading }">
                        <div
                            v-if="loading"
                            style="border-left-color: rgba(88, 151, 251, 0.71)"
                            class="vs__spinner"
                        >
                        </div>
                    </template>
                </v-select>
            </div>

            <hr class="mx-n4">

            <div class="mb-3">
                <label for="input__tanggal_wawancara" class="form-label required">Tanggal Wawancara :</label>
                <input type="date" id="input__tanggal_wawancara" class="form-control" v-model="form.tanggal_wawancara" :min="getToday()" required />
            </div>

            <div class="row mb-3 justify-content-between">
                <div class="col-lg-6 mb-3">
                    <label for="input__waktu-mulai" class="form-label required">Waktu Mulai :</label>
                    <input type="time" id="input__waktu-mulai" class="form-control" v-model="form.waktu_mulai" required />
                </div>
                <div class="col-lg-6 mb-3">
                    <label for="input__waktu-akhir" class="form-label required">Waktu Berakhir :</label>
                    <input type="time" id="input__waktu-akhir" class="form-control" v-model="form.waktu_akhir" required />
                </div>
            </div>

            <hr class="mx-n4">

            <div class="mb-3">
                <label for="input__petugas_nama" class="form-label required">Nama Petugas :</label>
                <input type="text" id="input__petugas_nama" class="form-control" v-model="form.nama_petugas" placeholder="Nama dari petugas pelaksana" required />
            </div>

            <div class="mb-3">
                <label for="input__petugas_nik" class="form-label required">NIK Petugas :</label>
                <InputMask
                    id="ssn"
                    v-model="form.nik_petugas"
                    mask="9999999999999999"
                    placeholder="________________"
                    class="form-control"
                    required
                />
            </div>
        </template>
    </ModalDialog>
</template>
