// Utils
import { fetchApi } from "./api"
import { SwalNotification } from "./swalNotification"
// Tipos
import type { Product, Category } from "../assets/types/types"
import Swal from "sweetalert2"



export const CategoryDB = {
    add: async (categoryName: string, imgURL: File) => {

        // Check text/image not empty
        if (!categoryName.trim()) {
            throw "Introduzca un nombre para la categoría"
        }
        if (!imgURL) {
            throw "Seleccione una imagen para la categoría"
        }

        const formData = new FormData();
        formData.append("nombre", categoryName);
        formData.append("imagen", imgURL);

        // Actualizar backend
        const createdCategory = await fetchApi("categorias", "POST", formData, true);
        return createdCategory as Category
    },
    delete: async (categoryId : string) => {
        await fetchApi(`categorias/${categoryId}`, "DELETE");
    },
    edit: async (categoryId: string, editedCategory : Category, newImage? : File) => { 
        const {nombre} = editedCategory

        /* Hay algún campo sin completar*/
        if (!nombre.trim()) {
            SwalNotification.fire({
                icon: "error",
                title: "Falta un nombre en la categoría"
            });
            return;
        }

        // Crear formulario de datos
        const formData = new FormData()
        formData.append("nombre", nombre)
        if (newImage) formData.append("imagen", newImage);

        /* POST a la DB */
        try {
            await fetchApi(
                `categorias/${categoryId}`,
                "PATCH",
                formData,
                true
            );

            /* Retorna el item editado */
            editedCategory.id = categoryId
            return editedCategory
        }
        catch (error) {
            console.error("Error al actualizar la categoría --", error);
        }
    },
    getAll: async () => {
        try {
            const categoriesData: Category[] = await fetchApi("categorias");

            return categoriesData

        } catch (error) {
            console.error("Error al obtener las categorías:", error);
            return []
        }
    }
}


export const ProductDB = {
    add: async (newProduct: Product, newImage: File) => {
        const { nombre, precio, descripcion, categoriaId, imagen } = newProduct;

        if (!nombre || !descripcion || !precio || !categoriaId) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Todos los campos obligatorios deben estar completos!",
                footer: '<a href="#">Why do I have this issue?</a>'
            });
            return;
        }

        const formData = new FormData()
        formData.append("nombre", nombre)
        formData.append("descripcion", descripcion)
        formData.append("precio", String(precio))
        formData.append("categoriaId", categoriaId)
        if (newImage) formData.append("imagen", newImage);

        try {
            const response = await fetchApi(
                `platos/categorias/${categoriaId}/platos`,
                "POST",
                formData,
                true
            );

            console.log("✅ Respuesta del servidor:", response);
            Swal.fire({
                title: "Completado!",
                icon: "success",
                text: "Producto agregado exitosamente",
                draggable: true
            });


            return response; // usa lo que devuelva tu backend
        } catch (error) {
            console.error("Error al agregar el producto:", error);
        }
    },
    delete: async (producId: string, categoriaId: string) => {
        // Edicion base de datos
        await fetchApi(`platos/categorias/${categoriaId}/${producId}`, "DELETE");
    },
    edit: async (productId: string, editedProduct: Product, newImage?: File) => {

        const { nombre, precio, descripcion, categoriaId, precioDescuento, imagen } = editedProduct

        /* Hay algún campo sin completar*/
        if (!nombre || !precio || !categoriaId) {
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
        if (newImage) formData.append("imagen", newImage);

        /* POST a la DB */
        try {
            await fetchApi(
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
    },  
    getAll: async () => {

        try {
            const itemsData: Product[] = await fetchApi("platos");

            return itemsData

        } catch (error) {
            console.error("Error al obtener los ítems", error);
            return []
        }

    }
}