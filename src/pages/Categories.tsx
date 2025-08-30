// Librerias
import React, { useState, useContext } from "react";
import Swal from 'sweetalert2'
// Utils
import { fetchApi } from "../utils/api";
import { addCategory } from "../utils/productDBHandler";
import { SwalNotification } from "../utils/swalNotification";
// Contextos
import { ProductDataContext } from "../contexts/ProductsDataContext";
import { usePopUpDispatch } from "../contexts/PopUpContext";
// Estilos y tipos
import '../assets/styles/categoryPage.css'
import type { Category } from "../assets/types/types";
import { swalThemeConfig } from "../assets/ThemeData";



export default function Categories() {

    const { categoriesList, initCategoriesList } = useContext(ProductDataContext)

    const [newCategory, setNewCategory] = useState("");
    const [imgURL, setImgURL] = useState<File | null>(null);


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

            // Notificacion (Se emite antes porque no hay feedback sino)
            Swal.fire({
                title: "completado!",
                icon: "success",
                text: "categoria creada con exito",
                draggable: true
            });

            //  Actualizar backend
            const categoryObject = await addCategory(newCategory, imgURL)

            // Actualizar local (El backend devuelve el objeto)
            if (categoryObject) initCategoriesList([...categoriesList, categoryObject])


        }
        catch (error) {   
            switch (error) {
                case "Introduzca un nombre para la categoría":
                case "Seleccione una imagen para la categoría":
                    SwalNotification.fire({
                        title: "Ops...",
                        icon: "error",
                        text: error,
                        draggable: true
                    });
                    break
                default:
                    Swal.fire({
                        title: "Ops...",
                        icon: "error",
                        text: "Ocurrió un error inesperado",
                        draggable: true
                    });
                    console.log(error)
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
                await fetchApi(`categorias/${categoryId}`, "DELETE");
                initCategoriesList(categoriesList.filter((c: Category) => c.id !== categoryId));
            }
            catch (error) {
                console.error("Error al eliminar la categoría", error);
            }
        }
    };


    /////// Formulario de edición de categoría
    const { handleIsVisible, handleIsEditing, handleFormDataCat, handleFormType } = usePopUpDispatch()


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
