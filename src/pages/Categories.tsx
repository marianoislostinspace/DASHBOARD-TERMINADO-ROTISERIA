// Librerias
import React, { useState, useContext } from "react";
import Swal from 'sweetalert2'
// Utils
import { CategoryDB } from "../utils/DataBase";
import { SwalNotification, SwalUnexpectedError } from "../utils/swalNotification";
// Contextos
import { ProductDataContext } from "../contexts/ProductsDataContext";
import { usePopUpDispatch } from "../contexts/PopUpContext";
// Estilos y tipos
import '../assets/styles/categoryPage.css'
import type { Category } from "../assets/types/types";
import { swalThemeConfig } from "../assets/ThemeData";
import { ValidationError } from "../assets/errors";



export default function Categories() {

    const { categoriesList, initCategoriesList } = useContext(ProductDataContext)

    // Formulario de edición de categoría
    const { handleIsVisible, handleIsEditing, handleFormDataCat, handleFormType } = usePopUpDispatch()

    // States
    const [newCategory, setNewCategory] = useState("");
    const [imgURL, setImgURL] = useState<File | undefined>(undefined);

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

        try {

            // Notificacion (Se emite antes porque sino no hay feedback)
            SwalNotification.fire({
                title: "Completado!",
                icon: "success",
                text: "categoria creada con exito",
                draggable: true
            });

            //  Actualizar backend
            const categoryObject = await CategoryDB.add(newCategory, imgURL as File)

            // Actualizar local (El backend devuelve el objeto)
            if (categoryObject) initCategoriesList([...categoriesList, categoryObject])


        }
        catch (error) {   
            if (error instanceof ValidationError) {
                SwalNotification.fire({
                    title: "Error",
                    icon: "error",
                    text: error.message,
                    draggable: true
                })
            } else {
                SwalUnexpectedError.fire({text: (error as Error).name})
            }
        }
    };

    // Eliminar categorías
    const handleDeleteCategory = async (categoryId: string) => {
        const result = await Swal.fire({
            ...swalThemeConfig,
            title: "¿Estás seguro que quieres eliminar esta categoria?",
            text: "¡No hay vuelta atrás!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar"
        });

        if (result.isConfirmed) {
            try {
                // Edit Backend
                CategoryDB.delete(categoryId)

                // Edit Frontend
                initCategoriesList(categoriesList.filter((c: Category) => c.id !== categoryId));
            }
            catch (error) {
                SwalUnexpectedError.fire({text: (error as Error).name})
            }
        }
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
                    <h2>Categorías</h2>
                    {categoriesList && categoriesList.length > 0 ? (
                        <ul>
                            {categoriesList.map((category) => (
                                <li key={category.id}>
                                    {category.nombre}
                                    <div className="actions">
                                        <button className="deleteButton" onClick={() => handleDeleteCategory(category.id)}>Eliminar</button>
                                        <button className="editButton" onClick={() => handleEditFields(category)}>Editar</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay categorías disponibles</p>
                    )}

                    {/* Formulario para agregar nueva categoría */}
                    <form onSubmit={handleAddCategory} className="formulario">
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
                        />
                        <button type="submit">Agregar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
