// Librerias
import { useState } from "react"
// Estilos y tipos
import type { Category } from "../../assets/types/types"
import "../../assets/styles/productForm.css"
import { usePopUpDispatch, usePopUpStates } from "../../contexts/PopUpContext"
import { editProduct, addProduct } from "../../utils/productDBHandler"
import Swal from "sweetalert2"

interface Props {
  categories: Category[]
}

export const ProductForm = ({ categories }: Props) => {
  const { isVisible, formData, formType } = usePopUpStates()
  const { handleIsEditing, handleIsVisible, handleInputChange, handleCategoryChange, handleFormDataCat } =
    usePopUpDispatch()

  const [newImage, setNewImage] = useState<File | null>(null)
  const [newImageCat, setNewImageCat] = useState<File | null>(null)

  const [activeForm, setActiveForm] = useState<"product" | "category" | "add" | null>("product")



  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newImage) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar una imagen para el producto!"
      })
      return
    }
    const productToSend = {
      ...formData
    }
    await addProduct(productToSend, newImage)

    handleCloseForm()
  }



  // Se encarga de la edición de productos
  const handleEditItem = async (e: React.FormEvent) => {

    e.preventDefault()

    if (!newImage) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar una imagen para el producto!"
      })
      return
    }
    e.preventDefault()
    editProduct(formData.id, formData, newImage)
    handleCloseForm()
  }

  // Se encarga de la edición de categorías
  const handleEditCategory = (e: React.FormEvent) => {
    e.preventDefault()
    // 🚀 acá llamarías a tu lógica de editar categoría (puede venir del contexto igual que producto)
    handleFormDataCat({
      id: "idCategoriaX",
      nombre: "Nuevo nombre",
      imagen: newImageCat ? URL.createObjectURL(newImageCat) : ""
    })
    console.log("Categoría editada desde contexto")
    handleCloseForm()
  }

  const handleCloseForm = () => {
    handleIsEditing(false)
    handleIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div id="pf-popup-container">
      <div className="pf-background" onClick={handleCloseForm}></div>

      <div className={`edit-form ${isVisible ? "open-form" : ""}`}>

        {formType === "product" && (
          <>
            <h3>Editar Producto</h3>
            <form onSubmit={handleEditItem}>
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
                accept="image/*"
                onChange={(e) => e.target.files && setNewImage(e.target.files[0])}
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
          </>
        )}

        {formType === "category" && (
          <>
            <h3>Editar Categoría</h3>
            <form onSubmit={handleEditCategory}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de categoría"
                onChange={(e) =>
                  handleFormDataCat({
                    id: "idCategoriaX", // ⚡ en tu app real deberías tener el id actual
                    nombre: e.target.value,
                    imagen: newImageCat ? URL.createObjectURL(newImageCat) : ""
                  })
                }
              />
              <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewImageCat(e.target.files[0])} />
              <button type="submit">Actualizar Categoría</button>
            </form>
          </>
        )}

        {formType == "add" && (
          <>
            <h3>Agregar Producto</h3>
            <form onSubmit={handleAddItem}>
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
                accept="image/*"
                onChange={(e) => e.target.files && setNewImage(e.target.files[0])}
              />
              <select name="categoriaId" value={formData.categoriaId} onChange={handleCategoryChange}>
                <option value="">Selecciona una categoría</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nombre}
                  </option>
                ))}
              </select>
              <button type="submit">Agregar Producto</button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
