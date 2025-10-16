// Librerías
import { useContext, createContext, useReducer } from "react"
// Utils
import { CategoryDB } from "../utils/DataBase"
import { Notifications } from "../utils/swalNotification"
import { handleBackendError } from "../assets/errors"
import { genericReducer } from "../utils/genericReduser"
// Types
import type { Category } from "../assets/types/types"

// --------------- Contexto --------------

interface CategoriesContext {
  categoriesList: Category[],
  CategoryStorage: {
    add: (newCategory: string, image: File) => void,
    edit: (editedCategory: Category, newImage: File) => void,
    delete: (categoryId: string) => void,
    initialize: (categoriesList: Category[]) => void
  }
}

export const CategoriesContext = createContext<CategoriesContext | undefined>(undefined)

// ---------------- Provider --------------

export const CategoriesProvider = ({ children }: { children: React.ReactNode }) => {

  const [categoriesList, dispatch] = useReducer(genericReducer<Category>, [])

  const CategoryStorage = {
    add: (newCategory: string, image: File) => {
      Notifications.fireLoading()

      CategoryDB.add(newCategory, image)
        .then((returnedCategory) => {

          dispatch({ type: "ADD", payload: { newObject: returnedCategory } })

          Notifications.fireSuccess()

        })
        .catch(handleBackendError)
    },
    edit: (editedCategory: Category, newImage: File) => {
      Notifications.fireLoading()

      CategoryDB.edit(editedCategory.id, editedCategory, newImage)
        .then(() => {
          dispatch({ type: "EDIT", payload: { editedObject: editedCategory } })
          Notifications.fireSuccess()
        })
        .catch(handleBackendError)
    },
    delete: async (categoryId: string) => {
      
      // Confirmación de eliminación
      const result = await Notifications.getUserConfirmation()
      if (!result.isConfirmed) return

      Notifications.fireLoading()

      CategoryDB.delete(categoryId)
        .then(() => {
          dispatch({ type: "DELETE", payload: { objectId: categoryId } })

          Notifications.fireSuccess()
        })
        .catch(handleBackendError)
      
    },
    initialize: (categoriesList: Category[]) => dispatch({ type: "INITIALIZE", payload: categoriesList })
  }

  return (
    <CategoriesContext.Provider value={{ categoriesList, CategoryStorage }}>
      {children}
    </CategoriesContext.Provider>
  )
}


export const useCategoryStorage = () => {
  const ctx = useContext(CategoriesContext);
  if (!ctx) throw new Error("useProductsStorage debe usarse dentro de PedidoProvider");
  return ctx;
} 