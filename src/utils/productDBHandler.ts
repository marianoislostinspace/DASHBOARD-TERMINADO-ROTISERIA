import type { Product } from "../assets/types/types"
import { fetchApi } from "../api"
import Swal from "sweetalert2";

export const SwalNotification = Swal.mixin({
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


export const addProduct = (product: Product) => {

}

export const editProduct = async (productId: string, editedProduct: Product) => {

    const { nombre, precio, descripcion, categoriaId, precioDescuento, imagen } = editedProduct

    /* Hay algún campo sin completar*/
    if (!nombre || !precio || !categoriaId) {
        /*
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "todos los campos deben ser completados",
          footer: '<a href="#">Why do I have this issue?</a>'
        }); */
        SwalNotification.fire({
            icon: "error",
            title: "Faltan campos"
        });
        return;
    }

    // Crear formulario de datos
    const formData = new FormData()
    formData.append("nombre", nombre)
    formData.append("descripcion", descripcion)
    formData.append("precio", String(precio))
    formData.append("categoriaId", categoriaId)
    if (precioDescuento) formData.append("precioDescuento", String(precioDescuento));
    if (imagen) formData.append("imagen", imagen);

    /* POST a la DB */
    try {
        const response = await fetchApi(
            `platos/categorias/${categoriaId}/platos/${productId}`,
            "PATCH",
            formData,
            true
        );

        /* Retorna el item editado */
        editedProduct.id = productId
        return editedProduct
    }
    catch (error) {
        console.error("Error al actualizar el producto:", error);
    }
}

export const getProducts = (): Product[] => {
    return []
}

