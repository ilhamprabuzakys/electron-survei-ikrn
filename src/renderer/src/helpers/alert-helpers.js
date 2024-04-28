import Swal from "sweetalert2";

export const showModal = (id) => document.querySelector(`button[data-bs-target="#${id}"]`).click();
export const hideModal = () => document.querySelector('button[data-bs-dismiss="modal"]').click();

export const alertLoading = () => {
    Swal.fire({
        title: 'Tunggu sebentar',
        icon: 'info',
        html: `Sedang <b>memproses</b> permintaan anda  ...`,
        showConfirmButton: true,
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });
}

export const alertConfirm = (text, confirmButtonText) => {
    return Swal.fire({
        title: 'Apakah anda yakin',
        html: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmButtonText ? confirmButtonText : 'Ya, hapus data',
        cancelButtonText: 'Batalkan',
    });
}

export const alertSuccess = (title, text, timer) => {
    Swal.fire({
        title: title,
        html: text,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: timer ?? 0,
    });
}

export const alertError = (title, text, timer) => {
    Swal.fire({
        title: title,
        html: text,
        icon: 'error',
        confirmButtonText: 'OK',
        timer: timer ?? 0,
    });
}

export const alertInfo = (title, text) => {
    Swal.fire({
        title: title,
        html: text,
        icon: 'info',
        confirmButtonText: 'Saya mengerti',
        timer: 0,
    });
}

export const alertGenericError = () => {
	Swal.fire({
        title: "Terjadi kesalahan",
        html: `Terjadi kesalahan tidak diketahui, tolong kontak <strong>developer</strong> untuk mengatasi masalah ini.`,
        icon: "error",
        confirmButtonText: "OK",
    });
}

export const alertClose = () => Swal.close();