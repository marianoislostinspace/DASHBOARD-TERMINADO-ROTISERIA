// Librerias
import { MouseEventHandler, useContext, useState } from "react";
// Estilos y tipos
import type { Category } from "../types/types";
import "../styles/productForm.css"
import { usePopUpDispatch, usePopUpStates } from "./contexts/PopUpContext";
import { editProduct } from "../helpers/productDBHandler";

interface Props {
  categories: Category[]
}


export const ProductForm = ({ categories }: Props) => {
  // Estados para editar el ítem
  const {isVisible, formData} = usePopUpStates()
  const {handleIsEditing, handleIsVisible, handleInputChange, handleCategoryChange} = usePopUpDispatch()
  const [newImage, setnewImage] = useState<File | null>(null)


  // Se encarga de la edición de productos.
  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();

    editProduct(formData.id, formData)
  };

  const handleCloseForm = (e: React.MouseEvent) => {

    handleIsEditing(false)
    handleIsVisible(false)

  }

  

  return (
    <>
    { isVisible ? <div id="pf-popup-container">
      <div className="pf-background" onClick={handleCloseForm}></div>

      <div className={`edit-form ${isVisible ? 'open-form' : ''}`}>
        <h3>Editar Producto</h3>
        <form onSubmit={(e) => handleEditItem(e)}>
          <input
            type="text"
            value={formData.nombre}
            name="nombre"
            onChange={handleInputChange}
            placeholder="Nombre"
          />
          <input
            type="text"
            value={formData.descripcion}
            name="descripcion"
            onChange={handleInputChange}
            placeholder="Descripción"
          />
          <input
            type="number"
            value={formData.precio}
            name="precio"
            onChange={handleInputChange}
            placeholder="Precio"
          />
          <input
            type="file"
            accept="image/"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setnewImage(e.target.files[0]);
              }
            }}
          />
          <select name="categoriaId" value={formData.categoriaId} onChange={handleCategoryChange}>
            <option value="">Selecciona una categoría</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.nombre}
              </option>
            ))}
          </select>
          <button type="submit">Actualizar Producto</button>
        </form>
      </div>
    </div>
    : <span></span>

    }
    
    
    
    </>
    
    

  )
}
