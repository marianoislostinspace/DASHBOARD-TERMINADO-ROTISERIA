// Librerias
import { useState } from "react"
// Context
import { usePopUpDispatch, usePopUpStates } from "../../contexts/PopUpContext"
// Utils
import { SwalNotification } from "../../utils/swalNotification"
import { ProductDB, CategoryDB } from "../../utils/DataBase"
// Estilos y tipos
import type { Category } from "../../assets/types/types"
import "../../assets/styles/popUp.css"


interface Props {
  categories: Category[]
}

export const PopUpForm = ({ categories }: Props) => {
  const { isVisible, formData, formDataCat, formType } = usePopUpStates()
  const { handleIsEditing, handleIsVisible, handleInputChange, handleCategoryChange, handleFormDataCat } =
    usePopUpDispatch()

  const [newImage, setNewImage] = useState<File | null>(null)
  const [newImageCat, setNewImageCat] = useState<File | null>(null)

  const [activeForm, setActiveForm] = useState<"product" | "category" | "add" | null>("product")



  // Agrega un producto cuando detecta un Submit
  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()

    // Check there is an image
    if (!newImage) {
      SwalNotification.fire({
        icon: "error",
        title: "Oops...",
        text: "Debes seleccionar una imagen para el producto!"
      })
      return
    }

    // Add to Database
    await ProductDB.add({ ...formData }, newImage)

    // Close form
    handleCloseForm()
  }


  // Se encarga de la edición de productos
  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault()

    // Actualiza la base de datos
    ProductDB.edit(formData.id, formData, newImage as File)

    // TODO: Actualiza local

    // Cierra el formulario
    handleCloseForm()
  }


  // Se encarga de la edición de categorías
  const handleEditCategory = async(e: React.FormEvent) => {
    e.preventDefault()

    e.preventDefault();

    try {

      // Notificacion (Se emite antes porque sino no hay feedback)
      SwalNotification.fire({
        title: "Completado!",
        icon: "success",
        text: "categoria actualizada con exito",
        draggable: true
      });

      //  Actualizar backend
      const categoryObject = await CategoryDB.edit(formDataCat.id, formDataCat, newImageCat as File)

      // Actualizar local (El backend devuelve el objeto)
      /*
      if (categoryObject) {
        initCategoriesList(
        categoriesList.map((c: Category) =>
        c.id === categoryObject.id ? categoryObject : c
          )
        )
      }
      */

    }
    catch (error) {
      console.error(error)
    }
    handleCloseForm()
  }

  // cierra el formulario
  const handleCloseForm = () => {
    handleIsEditing(false)
    handleIsVisible(false)
  }

  // ???
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

        {/* FORMULARIO DE CATEGORÍA */}

        {formType === "category" && (
          <>
            <h3>Editar Categoría</h3>
            <form onSubmit={handleEditCategory}>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre de categoría"
                onChange={handleInputChange}
                value={formDataCat.nombre}
              />
              <input type="file" accept="image/*" onChange={(e) => e.target.files && setNewImageCat(e.target.files[0])} />
              <button type="submit">Actualizar Categoría</button>
            </form>
          </>
        )}

        {/* Formulario para agregar productos */}
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
