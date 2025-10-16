// Libraries
import { useContext, createContext, useReducer } from "react"
import { Notifications } from "../utils/swalNotification"
// Utils
import { genericReducer } from "../utils/genericReduser"
import { ProductDB, ProductOptionsDB } from "../utils/DataBase"
import { handleBackendError } from "../assets/errors"
// Types
import type { Product, ProductOption } from "../assets/types/types"

// ---------------- Context ---------------

interface ProductsContext {
  productsList: Product[],
  ProductStorage: {
    add: (newProduct: Product, image: File) => void,
    addOption: (product: Product, newOption: ProductOption) => void,
    edit: (editedProduct: Product, newImage: File) => void,
    delete: (productId: string, categoryid: string) => void,
    deleteOption: (product: Product, optionId: string) => void,
    initialize: (productList: Product[]) => void
  }
}

export const ProductsContext = createContext<ProductsContext | undefined>(undefined)

// ---------------- Provider --------------

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {

  const [productsList, dispatch] = useReducer(genericReducer<Product>, [])

  const ProductStorage = {
    // Agrega un producto
    add: (newProduct: Product, image: File) => {
      Notifications.fireLoading()

      ProductDB.add(newProduct, image)
        .then((serverResponse) => {

          dispatch({ type: "ADD", payload: { newObject: serverResponse } })

          Notifications.fireSuccess()
        }).catch(handleBackendError)

    },
    // Agrega una opción de producto
    addOption: async (product: Product, newOption: ProductOption) => {
      Notifications.fireLoading()

      await ProductOptionsDB.add(product, newOption)
        .then(({id}) => {
          newOption.id = id
          product.opciones = [...product.opciones, newOption]
          dispatch({ type: "EDIT", payload: { editedObject: product } })

          Notifications.fireSuccess()
        })
        .catch(handleBackendError)
    },
    // Edita un producto
    edit: (editedProduct: Product, newImage: File) => {
      Notifications.fireLoading()

      ProductDB.edit(editedProduct.id, editedProduct, newImage)
        .then(() => {
          dispatch({type: "EDIT", payload: {editedObject: editedProduct}})
          Notifications.fireSuccess()
        })
        .catch(handleBackendError)
      
    },
    // Elimina un producto
    delete: async (productId: string, categoryId: string) => {
      const result = await Notifications.getUserConfirmation()
      if (!result.isConfirmed) return 
      
      Notifications.fireLoading()

      ProductDB.delete(productId, categoryId)
        .then(() => {
          dispatch({ type: "DELETE", payload: { objectId: productId } })

          Notifications.fireSuccess()
        })
        .catch(handleBackendError)
    },
    // Elimina una opción de producto
    deleteOption: async (product: Product, optionId: string) => {
      const result = await Notifications.getUserConfirmation()
      if (!result.isConfirmed){
        return
      }

      Notifications.fireLoading()

      ProductOptionsDB.delete(product, optionId)
        .then(() => {
          product.opciones = product.opciones.filter((o) => 
            {if (o.id != optionId) return o})

          dispatch({ type: "EDIT", payload: { editedObject: product } })
          Notifications.fireSuccess()
        })
        .catch(handleBackendError)
    },
    initialize: (productsList: Product[]) => dispatch({ type: "INITIALIZE", payload: productsList })
  }

  return (
    <ProductsContext.Provider value={{ productsList, ProductStorage }}>
      {children}
    </ProductsContext.Provider>
  )
}


export const useProductsStorage = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProductsStorage debe usarse dentro de PedidoProvider");
  return ctx;
} 