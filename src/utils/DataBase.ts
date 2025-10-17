// Utils
import { fetchApi } from "./api"
// Assets
import type { Product, Category, Pedido, ProductOption } from "../assets/types/types"
import { stateList } from "../hooks/useStateManager"
import { ValidationError } from "../assets/errors"


/// IMPORTANTE: Aquí no se hace ningún manejo de errores. 
// El detalle de los errores al comunicarse con el servidor se muestran con FetchAPI
// El feedback al usuario del error se da usando Catch al llamar a cada función. 

export const CategoryDB = {
    add: async (categoryName: string, imgURL: File) => {

        // Errores de campos obligatorios
        if (!categoryName.trim()) {
            throw new ValidationError("Campo de nombre de categoría incompleto")
        }
        if (categoryName.trim().length > 25) {
            throw new ValidationError("Exceso del límite de caracteres")
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
    edit: async (categoryId: string, editedCategory: Category, newImageCat?: File) => {
        const { nombre } = editedCategory

        // Errores de campos obligatorios
        if (!nombre.trim()) {
            throw new ValidationError("Campo de nombre de categoría incompleto")
        }
        if (nombre.trim().length > 25) {
            throw new ValidationError("Exceso del límite de caracteres")
        }
        // Se da formato al texto para que siempre la primera letra esté capitalizada.
        let name = nombre.toLowerCase()
        name = name.charAt(0).toUpperCase() + name.slice(1)


        // Crear formulario de datos
        const formData = new FormData()
        formData.append("nombre", name)
        if (newImageCat) formData.append("imagen", newImageCat);

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

    },
    getAll: async () => {
        const categoriesData: Category[] = await fetchApi("categorias");
        return categoriesData
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

        const response = await fetchApi(
            `platos/categorias/${categoriaId}/platos`,
            "POST",
            formData,
            true
        );
        return response; // usa lo que devuelva tu backend

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
        const itemsData: Product[] = await fetchApi("platos");
        return itemsData
    }
}

export const OrdersDB = {
    add: async (order : any) => {
        await fetchApi(`pedidos/`, "POST", order)
    },
    edit: async (id: string, formData: Pedido) => {
        await fetchApi(`pedidos/${id}`, "PATCH", formData)
    },
    delete: async (id: string) => {
        await fetchApi(`pedidos/${id}`, "DELETE")
    },
    getAll: async () => {
        const ordersData: Pedido[] = await fetchApi(`pedidos`)

        if (Array.isArray(ordersData)) {
            // Se asegura que cada pedido tiene un estado asignado
            ordersData.forEach((order) => {
                if (!order.state) {
                    order.state = stateList[0]
                }
            })

            return ordersData
        }

        return []
    }
}

export const ProductOptionsDB = {
    add: async (product: Product, newOption: ProductOption) => {
        const option = await fetchApi(
            `opciones/${product.categoriaId}/${product.id}`,
            "POST",
            newOption
        );

        return option
    },
    delete: async (product: Product, optionId: string) => {
        await fetchApi(`opciones/${product.categoriaId}/${product.id}/${optionId}`, "DELETE");
    }
}