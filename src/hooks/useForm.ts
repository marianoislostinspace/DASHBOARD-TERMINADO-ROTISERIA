import {useState} from 'react'
import type { Product } from '../assets/types/types'

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

export const useForm = () => {
 
    const [formState, setFormState] = useState<Product>(emptyProduct)

    const onInputChange = ({target} : React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = target

        console.log(name, value)
        setFormState({
            ...formState,
            [name]:value
        })
    }

    


  return {
    formState,
    onInputChange
  }
}
