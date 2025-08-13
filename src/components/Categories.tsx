import React, { useEffect, useState } from "react";
import { fetchApi } from "../services/api";
import Swal from 'sweetalert2'


type Props = {}

export default function Categories({ }: Props) {
    interface Category {
        id: string;
        nombre: string;
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

            const createdCategory = await fetchApi("categorias", "POST", { nombre: newCategory });
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

    const logcat = () => {
        console.log(Categories)
    }

    return (
        <div className="categoriesContainer">
            <div className="categories">
                <div>
                    <h2>Categorías</h2>
                    {Categories && Categories.length > 0 ? (
                        <ul>
                            {Categories.map((category) => (
                                <li key={category.id}>
                                    {category.nombre}
                                    <button onClick={() => handleDeleteCategory(category.id)}>Eliminar</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay categorías disponibles</p>
                    )}

                    {/* Formulario para agregar nueva categoría */}
                    <form onSubmit={handleAddCategory}>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Nueva Categoría"
                        />
                        <button type="submit">Agregar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
