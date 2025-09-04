// Utils
import { fetchApi } from "./api"
import { SwalNotification } from "./swalNotification"
// Assets
import type { Product, Category } from "../assets/types/types"
import { ValidationError } from "../assets/errors"



export const CategoryDB = {
    add: async (categoryName: string, imgURL: File) => {

        // Errores de campos obligatorios
        if (!categoryName.trim()) {
            throw new ValidationError("Campo de nombre de categoría incompleto")
        }
        if (!imgURL) {
            throw new ValidationError("Ninguna imagen seleccionada para la categoría")
        }

        const formData = new FormData();
        formData.append("nombre", categoryName);
        formData.append("imagen", imgURL);

        // Actualizar backend

        const createdCategory = await fetchApi("categorias", "POST", formData, true);
        return createdCategory as Category
    },
    delete: async (categoryId: string) => {
        await fetchApi(`categorias/${categoryId}`, "DELETE");
    },
    edit: async (categoryId: string, editedCategory: Category, newImage?: File) => {
        const { nombre } = editedCategory

        // Errores de campos obligatorios
        if (!nombre.trim()) {
            throw new ValidationError("Campo de nombre de categoría incompleto")
        }

        // Crear formulario de datos
        const formData = new FormData()
        formData.append("nombre", nombre)
        if (newImage) formData.append("imagen", newImage);

        try {
            /* POST a la DB */
            await fetchApi(
                `categorias/${categoryId}`,
                "PATCH",
                formData,
                true
            );

            /* Retorna el item editado */
            editedCategory.id = categoryId
            return editedCategory
        } catch (e) {
            console.error("Ocurrió un error editando las categorías: ", (e as Error).message)
        }

    },
    getAll: async () => {
        try {
            const categoriesData: Category[] = await fetchApi("categorias");

            return categoriesData

        } catch (error) {
            console.error("Error al obtener las categorías:", (error as Error).message);
            return []
        }
    }
}


export const ProductDB = {
    add: async (newProduct: Product, newImage: File) => {
        const { nombre, precio, descripcion, categoriaId, imagen } = newProduct;

        // Errores de campos obligatorios
        if (!nombre || !descripcion || !precio || !categoriaId) {
            throw new ValidationError("Hay campos de producto incompletos")
        }

        // Formulario
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
            throw new ValidationError("Hay campos de producto incompletos")
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
        await fetchApi(
            `platos/categorias/${categoriaId}/platos/${productId}`,
            "PATCH",
            formData,
            true
        );

        /* Retorna el item editado */
        editedProduct.id = productId
        return editedProduct

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