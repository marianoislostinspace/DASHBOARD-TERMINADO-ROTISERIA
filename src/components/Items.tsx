import React, { useEffect, useState } from "react";
import { fetchApi } from "../utils/api";
import Swal from 'sweetalert2'


type Props = {};

export const Items = (props: Props) => {
  interface Product {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen: File | null;
    categoriaId: string;
  }

  interface Category {
    id: string;
    nombre: string;
  }

  // Estados del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [discountPrice, setdiscountPrice] = useState<number | "">("")
  const [imgURL, setImgURL] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);


  // Estado para almacenar las categorías
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data: Category[] = await fetchApi("categorias");
        setCategories(data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };
    getCategories();
  }, []);



  // Función para manejar la selección de archivo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgURL(e.target.files[0]);
      console.log("Archivo seleccionado:", e.target.files[0]);
    } else {
      console.log("No se seleccionó ningún archivo");
    }
  };



  // Función para manejar el envío del formulario
  const handleAddProduct = async (e: React.FormEvent, categoriaId: string) => {
    e.preventDefault();

    if (!name || !description || !price || !imgURL || !categoryId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Todos los campos obligatorios deben estar completos!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    const formData = new FormData();
    formData.append("nombre", name);
    formData.append("descripcion", description);
    formData.append("precio", String(price));
    formData.append("categoryId", categoryId);

    if (imgURL) {
      formData.append("imagen", imgURL);
    } else {
      console.error("❌ No se ha seleccionado una imagen.");
      return;
    }

    // 📌 Log para revisar lo que se está enviando
    console.log("🔹 FORM DATA:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });

    try {
      const response = await fetchApi(`platos/categorias/${categoriaId}/platos`, "POST", formData, true);
      console.log("✅ Respuesta del servidor:", response);
      Swal.fire({
        title: "Completado!",
        icon: "success",
        text: "Producto agregado exitosamente",
        draggable: true
      });
      setName("");
      setDescription("");
      setPrice("");
      setdiscountPrice("");
      setImgURL(null);
      setCategoryId("");
    } catch (error) {
      console.error("❌ Error al agregar el producto:", error);
    }
  };



  return (
    <div className="itemContainer">
      <div className="edit-form">
        <form onSubmit={(e) => handleAddProduct(e, categoryId)}> {/* Usamos onSubmit aquí */}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre (obligatorio)" />
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción (obligatorio)" />
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} placeholder="Precio original (obligatorio)" />
          <input type="file" accept="image/*" className="file" onChange={handleFileChange} />

          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>

          <button type="submit">Agregar Producto</button> {/* Se usa "type='submit'" para enviar el formulario */}
        </form>
      </div>
    </div>
  );
};
