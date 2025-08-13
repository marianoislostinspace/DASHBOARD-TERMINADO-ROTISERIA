import { createContext, useState, useReducer, useContext } from 'react';
import type { Product } from '../../types/types';
 

export type PopUpActionType = "Set Visible" | "Set Editing" | "Edit Form" | "Submit Form" | "Clear Form"

interface PopUpState {
    isVisible: Boolean,
    isEditing: Boolean,
    formData: Product
}

interface PopUpMethods {
    handleIsVisible: (value: boolean) => void,
    handleIsEditing: (value: boolean) => void,
    handleFormData: (data: Product) => void
    handleInputChange: (event : React.ChangeEvent<HTMLInputElement>) => void,
    handleCategoryChange: (event : React.ChangeEvent<HTMLSelectElement>) => void
}

interface PopUpAction {
    type: PopUpActionType,
    payload: PopUpState,
}

const emptyProduct: Product = {
  id: "",
  categoriaId: "",
  nombre: "",
  descripcion: "",
  imagen: "",
  opciones: [],

  precio: 0,
  precioDescuento: 0
}

const initialStates : PopUpState = {
        isVisible: true,
        isEditing: false,
        formData: emptyProduct 
}

const defaultMethods : PopUpMethods = {
    handleIsVisible: (value: boolean) => {}, 
    handleIsEditing: (value: boolean) => {}, 
    handleFormData: (product: Product) => {},
    handleInputChange: (event : React.ChangeEvent<HTMLInputElement>) => {},
    handleCategoryChange: (event : React.ChangeEvent<HTMLSelectElement>) => {}
}

const PopUpReducer = (initialState : PopUpState, action : PopUpAction) : PopUpState => {

    switch (action.type) {
        case 'Set Visible':
            console.log("Set Visible: " + action.payload.isVisible)
            console.log(initialState)
            initialState.isVisible = action.payload.isVisible
            return initialState
        case 'Set Editing':
            initialState.isEditing = action.payload.isEditing
            return initialState
        case 'Edit Form':
            initialState.formData = action.payload.formData
            return initialState
        case 'Submit Form':
            return initialState
        case 'Clear Form':
            initialState.formData = emptyProduct
            return initialState
    }

}
const PopUpStateContext = createContext(initialStates)
const PopUpMethodsContext = createContext<PopUpMethods>(defaultMethods)

export const PopUpProvider = ({children} : {children: React.ReactNode}) => {
    
    const [isVisible, setisVisible] = useState<boolean>(true)
    const [isEditing, setIsEditing] = useState<boolean>(true)
    const [formData, setFormData] = useState<Product>(emptyProduct)

    const handleIsVisible = (value: boolean) => {
        console.log(value)
        setisVisible(value)
    }

    const handleIsEditing = (value: boolean) => {
        console.log(value)
        setIsEditing(value)
    }

    const handleFormData = (data: Product) => {
        setFormData(data)
    } 

    const handleInputChange = ({target} : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = target

        console.log(name, value)
        setFormData({
            ...formData,
            [name]: value
        })
    } 

    const handleCategoryChange = ({target} : React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = target

        console.log(name, value)
        setFormData({
            ...formData,
            [name]: value
        })
    } 
    return (
        <>
            <PopUpStateContext.Provider value={{isVisible, isEditing, formData}}>
                <PopUpMethodsContext.Provider value={{handleIsVisible, handleIsEditing, handleFormData, handleInputChange, handleCategoryChange}}>
                    {children}
                </PopUpMethodsContext.Provider>
            </PopUpStateContext.Provider>
        </>
    )
}

export const usePopUpStates = () => {
    return useContext(PopUpStateContext)
}

export const usePopUpDispatch = () => {
    return useContext(PopUpMethodsContext)
}

