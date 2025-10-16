// Librerias
import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Contextos
import { useCategoryStorage } from "../contexts/CategoriesContext";
import { usePopUpDispatch, usePopUpStates } from "../contexts/PopUpContext";
// Estilos y tipos
import '../assets/styles/categoryPage.css'
import type { Category } from "../assets/types/types";

// Icons
import { faTrashCan, faPenToSquare } from '@fortawesome/free-solid-svg-icons'; // Example icons

export default function Categories() {

    // Model
    const { categoriesList, CategoryStorage } = useCategoryStorage()

    // Formulario de edición de categoría
    const { handleIsVisible, handleIsEditing, handleFormDataCat, handleFormType } = usePopUpDispatch()
    const { formDataCat } = usePopUpStates()

    // States
    const [newCategory, setNewCategory] = useState("");
    const [imgURL, setImgURL] = useState<File | undefined>(undefined);
    const fileInputRef = useRef<HTMLInputElement>(null)

    // -----------------------------------------------------------------------

    // Función para manejar la selección de archivo (FileInput)
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgURL(e.target.files[0]);
        } else {
            console.log("No se seleccionó ningún archivo");
        }
    };

    // Agregar Categorías
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        CategoryStorage.add(newCategory, imgURL as File)

        // Limpiar formulario
        setNewCategory("")
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    };


    // Editar Categorías
    const handleUpdateCategory = async (e: React.FormEvent) => {
        e.preventDefault();

        CategoryStorage.edit(formDataCat, imgURL as File)
        
    };


    // Eliminar categorías
    const handleDeleteCategory = async (categoryId: string) => {
        CategoryStorage.delete(categoryId)
    };


    // Abre el formulario
    const handleEditFields = (categoria: Category) => {
        handleIsEditing(true)
        handleFormDataCat(categoria)
        handleIsVisible(true)
        handleFormType("category")
    }


    return (
        <div className="categoriesContainer">
            <div className="categories">
                <div className="subCat">
                    {categoriesList && categoriesList.length > 0 ? (
                        <ul>
                            {categoriesList.map((category) => (
                                <li key={category.id}>
                                    <span>{category.nombre}</span>
                                    <div className="actions">
                                        <button className="deleteButton" onClick={() => handleDeleteCategory(category.id)}>
                                            <FontAwesomeIcon icon={faTrashCan}></FontAwesomeIcon>
                                        </button>
                                        <button className="editButton" onClick={() => handleEditFields(category)}>
                                            <FontAwesomeIcon icon={faPenToSquare}></FontAwesomeIcon>
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay categorías disponibles</p>
                    )}

                    {/* Formulario para agregar nueva categoría */}
                    <form onSubmit={handleAddCategory} className="formulario">
                        {newCategory.length > 25 && <label className="errorLabel">Texto demasiado largo</label>}
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nueva Categoría"
                        />

                        <input
                            type="file"
                            accept="image/*" className="file"
                            onChange={handleFileChange}
                            placeholder="Nueva Categoría"
                            ref={fileInputRef}
                        />
                        <button type="submit">Agregar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
