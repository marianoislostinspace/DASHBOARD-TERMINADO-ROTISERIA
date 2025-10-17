import { createContext, useState, useContext } from "react"
import type { Category, Product } from "../assets/types/types"

// Estado del popup
interface PopUpState {
    isVisible: boolean
    isEditing: boolean
    formData: Product
    formDataCat: Category
    formType: "product" | "category" | "add" | null
}

// Métodos del popup
interface PopUpMethods {
    handleIsVisible: (value: boolean) => void
    handleIsEditing: (value: boolean) => void
    handleFormData: (data: Product) => void
    handleFormDataCat: (data: Category) => void
    handleFormType: (type: "product" | "category" | "add") => void
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    handleCategoryChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

// Valores iniciales
const emptyProductCat: Category = {
    id: "",
    nombre: "",
    imagen: ""
}

export const emptyProduct: Product = {
    id: "",
    categoriaId: "",
    nombre: "",
    descripcion: "",
    imagen: "",
    opciones: [],
    precio: 0,
    precioDescuento: 0,
    esVisible: true
}



// Contextos
const PopUpStateContext = createContext<PopUpState>({
    isVisible: false,
    isEditing: false,
    formData: emptyProduct,
    formDataCat: emptyProductCat,
    formType: null
})

const PopUpMethodsContext = createContext<PopUpMethods>({
    handleIsVisible: () => { },
    handleIsEditing: () => { },
    handleFormData: () => { },
    handleFormDataCat: () => { },
    handleFormType: () => { },
    handleInputChange: () => { },
    handleCategoryChange: () => { }
})

// Provider
export const PopUpProvider = ({ children }: { children: React.ReactNode }) => {
    const [isVisible, setIsVisible] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState<Product>(emptyProduct)
    const [formDataCat, setFormDataCat] = useState<Category>(emptyProductCat)
    const [formType, setFormType] = useState<"product" | "category" | "add" | null>(null)

    // Métodos
    const handleIsVisible = (value: boolean) => setIsVisible(value)
    const handleIsEditing = (value: boolean) => setIsEditing(value)
    const handleFormData = (data: Product) => setFormData(data)
    const handleFormDataCat = (categoria: Category) => setFormDataCat(categoria)
    const handleFormType = (type: "product" | "category" | "add") => setFormType(type)

    const handleInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = target
        
        if (formType == "category") {
            setFormDataCat({ ...formDataCat, [name]: value })
        } else {
            setFormData({ ...formData, [name]: value })
        }

    }

    const handleCategoryChange = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = target
        setFormData({ ...formData, [name]: value })
    }

    return (
        <PopUpStateContext.Provider value={{ isVisible, isEditing, formData, formDataCat, formType }}>
            <PopUpMethodsContext.Provider
                value={{
                    handleIsVisible,
                    handleIsEditing,
                    handleFormData,
                    handleFormDataCat,
                    handleFormType,
                    handleInputChange,
                    handleCategoryChange
                }}
            >
                {children}
            </PopUpMethodsContext.Provider>
        </PopUpStateContext.Provider>
    )
}

// Hooks
export const usePopUpStates = () => useContext(PopUpStateContext)
export const usePopUpDispatch = () => useContext(PopUpMethodsContext)

