import React, { useEffect, useState } from "react";
import { fetchApi } from "../api";
import Swal from 'sweetalert2'
import '../styles/categoryPage.css'
import { usePopUpDispatch } from "../contexts/PopUpContext";


type Props = {}

export default function Categories({ }: Props) {
    interface Category {
        id: string;
        nombre: string;
        imagen: string;
    }

    const [Categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data: Category[] = await fetchApi("categorias");
                setCategories(data);
            } catch (error) {
                console.error("error al obtener las categorias", error);
            }
        };
        getCategories();
    }, []);

    const [newCategory, setNewCategory] = useState("");
    const [imgURL, setImgURL] = useState<File | null>(null);


    // Función para manejar la selección de archivo
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setImgURL(e.target.files[0]);
            console.log("Archivo seleccionado:", e.target.files[0]);
        } else {
            console.log("No se seleccionó ningún archivo");
        }
    };


    // Agregar Categorías
    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategory.trim()) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "El nombre no puede estar vacio",
                footer: '<a href="#">Why do I have this issue?</a>'
            }); return;


        }

        try {
            Swal.fire({
                title: "completado!",
                icon: "success",
                text: "categoria creada con exito",
                draggable: true
            });

            const formData = new FormData();
            formData.append("nombre", newCategory);

            if (imgURL) {
                formData.append("imagen", imgURL);
            } else {
                console.error("❌ No se ha seleccionado una imagen.");
                return;
            }

            const createdCategory = await fetchApi("categorias", "POST", formData, true);
            setCategories([...Categories, createdCategory]);
            setNewCategory("");
        } catch (error) {
            console.error("error al crear la categoría", error);
        }
    };

    // Eliminar categorías
    const handleDeleteCategory = async (categoryId: string) => {
        const result = await Swal.fire({
            title: "¿Estás seguro que quieres eliminar esta categoria?",
            text: "¡No hay vuelta atrás!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar"
        });

        if (result.isConfirmed) {
            try {
                await fetchApi(`categorias/${categoryId}`, "DELETE");
                setCategories(Categories.filter((category) => category.id !== categoryId));
            }
            catch (error) {
                console.error("Error al eliminar la categoría", error);
            }
        }
    };




    const { handleIsVisible, handleIsEditing, handleFormDataCat, handleFormType } = usePopUpDispatch()

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
                    {Categories && Categories.length > 0 ? (
                        <ul>
                            {Categories.map((category) => (
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
