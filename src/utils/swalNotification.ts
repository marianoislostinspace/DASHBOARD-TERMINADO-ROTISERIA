import Swal from "sweetalert2";
import { swalThemeConfig } from "../assets/ThemeData";

export const SwalNotification = Swal.mixin({
    ...swalThemeConfig,
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

export const SwalUnexpectedError = Swal.mixin({
    ...swalThemeConfig,
    icon: "error",
    title: "Error Inesperado",
    text: "Ocurrió un error inesperado, pruebe nuevamente o contacte a un administrador si el error persiste."
})