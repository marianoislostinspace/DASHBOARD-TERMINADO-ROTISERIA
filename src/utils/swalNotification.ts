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

const IconNotification = Swal.mixin({
  ...swalThemeConfig,
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  width: 128,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const Notifications = {
  fireLoading: () => SwalNotification.fire({
    title: "Cargando...",
    icon: "info"
  }),
  fireSuccess: (text?: string) => {
    if (!text) {
      IconNotification.fire({ icon: "success" })
      return
    }

    SwalNotification.fire({
      icon: "success",
      text
    }
    )
  },
  fireError: (text?: string) => SwalNotification.fire({
    icon: "error",
    text
  }),
  fireUnexpectedError: (text: string = "Ocurrió un error inesperado, pruebe nuevamente o contacte a un administrador si el error persiste.") => Swal.fire({
    ...swalThemeConfig,
    icon: "error",
    title: "Error Inesperado",
    text
  }),
  getUserConfirmation: async (title : string = "¿Estás seguro que quieres continuar?") => {
    const result = await Swal.fire({
      ...swalThemeConfig,
      title,
      text: "¡No hay vuelta atrás!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar"
    });

    return result
  },

}