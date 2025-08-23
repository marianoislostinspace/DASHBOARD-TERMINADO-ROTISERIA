// Utils
import { fetchApi } from "./api"
import { SwalNotification } from "./swalNotification"
// Tipos
import type { Product, Category } from "../assets/types/types"




export const addProduct = (product: Product) => {

}

export const addCategory = async (categoryName : string, imgURL: File | null)=> {

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
}


export const editProduct = async (productId: string, editedProduct: Product) => {

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

export const editCategory = async () => {

}

export const deleteProduct = async (producId: string, categoriaId: string) => {
    // Edicion base de datos
    const newProductList = await fetchApi(`platos/categorias/${categoriaId}/${producId}`, "DELETE");

    console.log(newProductList)
}

export const getItemsAndCategories = async () => {
        
      try {
        const itemsData: Product[] = await fetchApi("platos");
        const categoriesData: Category[] = await fetchApi("categorias");

        return {"Products": itemsData, "Categories": categoriesData}

      } catch (error) {
        console.error("Error al obtener los ítems y categorías:", error);
      }
    };