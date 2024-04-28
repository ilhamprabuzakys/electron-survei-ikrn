<script setup>
import { onMounted, ref } from "vue";
import { useSurveiStore } from "@renderer/stores/survei";
import { dt_lang_config, formatDate, getToday, handleError, sleep } from "@renderer/helpers/form-helpers";
import { useRoute, useRouter } from 'vue-router'
import axios from "axios";
import { alertConfirm, alertLoading, alertSuccess } from "@renderer/helpers/alert-helpers";

import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs5';

import Heading from "@renderer/components/Heading.vue";

DataTable.use(DataTablesCore);

const router = useRouter();
const showDetailResponden = ref(false);
const store = useSurveiStore();

const fetchData = async () => {
    try {
        const response = await axios.get('/dashboard/survei/api/v1/data/');
        store.setDataSurveys(response.data.results);
    } catch (e) {
        handleError(e);
    }
}

const handleMulai = (id) => {
    router.push(`/pengisian/${id}`, { replace: false });
}

const dataResponden = ref();

const fetchDataResponden = async (parent) => {
    try {
        const response = await axios.get(`/dashboard/survei/api/v1/responden/?parent=${parent}`);
        dataResponden.value = response.data;
    } catch (e) {
        handleError(e);
    }
}

const handleResponden = async (id) => {
    await fetchDataResponden(id);
}

const handleDeleteResponden = async (id, parent) => {
    const confirmation = await alertConfirm(`Apakah anda yakin ingin <b>menghapus</b> data ini? <br>Data yang dihapus tidak dapat <b>dipulihkan</b> kembali!`);

    if (!confirmation.isConfirmed) return;

    alertLoading();

    await sleep(500);

    try {
        await axios.delete(`/dashboard/survei/api/v1/responden/${id}/`);
        await fetchData();
        await fetchDataResponden(parent);
        alertSuccess('Berhasil', `Data responden telah <b>berhasil</b> dihapus!`);
    } catch (e) {
        handleError(e);
    }
}

const handleHasilSurvei = (data) => {
    const kode = data.parent.kode;
    const id = data.id
    router.push(`/hasil/survei/${kode}/${id}`, { replace: false });
}

const handleHasilResponden = (id) => {
    router.push(`/hasil/responden/${id}`, { replace: false });
}

const checkDisabledState = (data) => data.total_responden === 0;

// DataTable
let dt;
const table = ref();

const columns = [
    { data: null, render: "#numbering", class: 'text-center', width: "5%" },
    { data: null, render: "#nama" },
    {
        data: 'tanggal_wawancara', width: "10%",
        render: (data, type, row) => formatDate(data)
    },
    {
        data: null, width: "10%",
        render: (data, type, row) => `${row.waktu_mulai} - ${row.waktu_akhir}`
    },
    {
        data: 'total_responden', width: "10%", class: 'text-center',
        render: (data, type, row) => `${data} orang`
    },
    { data: 'id', render: "#action", width: "8%" },
];

const columnsResponden = [
    { data: null, render: "#numbering", class: 'text-center', width: "5%" },
    { data: 'nama' },
    { data: 'nik' },
    { data: 'alamat' },
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
    <Heading title="Daftar Survei" icon="fas fa-tasks ms-2 text-primary" />

    <div class="table-responsive small mt-3">
        <DataTable :data="store.surveys" :options="options" :columns="columns" class="table table-bordered" ref="table">
            <thead>
                <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Judul Survei</th>
                    <th scope="col">Tgl. Wawancara</th>
                    <th scope="col">Waktu</th>
                    <th scope="col">Jumlah Responden</th>
                    <th scope="col">Aksi <i class="fas fa-edit ms-2"></i></th>
                </tr>
            </thead>
            <template #nama="props">
                <span @click="handleResponden(props.rowData.id)" class="cursor-pointer h-underline">{{ props.rowData.parent?.nama }}</span>
            </template>
            <template #numbering="props">
                {{ props.rowIndex+1 }}
            </template>
            <template #action="props">
                <div class="list-button py-2">
                    <button type="button" :disabled="checkDisabledState(props.rowData)" class="badge text-white" :class="checkDisabledState(props.rowData) ? 'bg-soft-light' : 'bg-primary'" @click="handleHasilSurvei(props.rowData)">
                        <i class="fas fa-list me-1"></i>
                        Hasil Pengisian
                    </button>
                    <button type="button" :disabled="checkDisabledState(props.rowData)" class="badge text-white" :class="checkDisabledState(props.rowData) ? 'bg-soft-light' : 'bg-warning'" @click="handleResponden(props.cellData)">
                        <i class="fas fa-user-group me-1"></i>
                        Responden
                    </button>
                    <button type="button" class="badge bg-success text-white" @click="handleMulai(props.cellData)">
                        <i class="fas fa-play me-1"></i>
                        Mulai
                    </button>
                </div>
            </template>
        </DataTable>
    </div>

    <template v-if="dataResponden">
        <div id="detailResponden" class="mt-4">
            <Heading title="Data Responden" icon="fas fa-users ms-2 text-warning">
                <template #action>
                    <button class="btn btn-sm btn-outline-danger me-4" @click="dataResponden = null">
                        <i class="fas fa-xmark me-2"></i>
                        Tutup
                    </button>
                </template>
            </Heading>

            <div class="table-responsive small mt-3">
                <DataTable :data="dataResponden" :options="options" :columns="columnsResponden" class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">No.</th>
                            <th scope="col">Nama</th>
                            <th scope="col">NIK</th>
                            <th scope="col">Alamat</th>
                            <th scope="col">Aksi <i class="fas fa-edit ms-2"></i></th>
                        </tr>
                    </thead>
                    <template #numbering="props">
                        {{ props.rowIndex+1 }}
                    </template>
                    <template #action="props">
                        <div class="list-button py-2">
                            <button type="button" class="badge bg-primary text-white" @click="handleHasilResponden(props.cellData)">
                                <i class="fas fa-list me-1"></i>
                                Hasil Pengisian
                            </button>
                            <button type="button" class="badge bg-danger text-white" @click="handleDeleteResponden(props.cellData, props.rowData.parent)">
                                <i class="fas fa-trash-alt me-1"></i>
                                Hapus
                            </button>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </template>
</template>
