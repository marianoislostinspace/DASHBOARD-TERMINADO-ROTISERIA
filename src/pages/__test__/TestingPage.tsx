import React from 'react'
import { popup2 } from '../../contexts/__test__/popup2'
import type { Product } from '../../assets/types/types'

let emptyProduct = {
    id: "string",
    nombre: "string",
    descripcion: "string",
    precio: 1,
    precioDescuento: 1,
    imagen: "string",
    opciones: [],
    categoriaId: "string",
    esVisible: true,
}

export const TestingPage = () => {
    const { testObject, generateForm } = popup2()

    let form = generateForm({
        Nombre: "string",
        Descripcion: "string",
        Precio: "number",
        Imagen: "file",
        Estado: ["Nuevo", "Usado", "Coso"]
    }) 

    return (
        <div>{form}</div>
    )
}
