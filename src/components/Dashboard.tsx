import React, { use, useEffect, useState } from "react";
import { fetchApi } from "../services/api";
import Swal from 'sweetalert2'


type Props = {};

interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioDescuento: number;
  imagen: string;
  opciones: Opcion[]
  categoriaId: string;
}

interface Opcion {
  id: string
  nombre: string;
  precio?: number; // Opcional
}


interface Category {
  id: string;
  nombre: string;
}

export const Dashboard = (props: Props) => {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estados para editar el ítem
  const [editItem, setEditItem] = useState<Product | null>(null);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [newDiscountPrice, setNewDiscountPrice] = useState<number | "">("");
  const [newCategoryId, setNewCategoryId] = useState("");
  const [detalle, setdetalle] = useState<Boolean>(false)
  const [singlePlato, setsinglePlato] = useState<Product | null>(null)
  const [newImage, setnewImage] = useState<File | null>(null)

  // Estados para agregar opción
  const [activeOptionFormId, setActiveOptionFormId] = useState<string | null>(null);
  const [optionName, setOptionName] = useState("");
  const [optionExtraPrice, setOptionExtraPrice] = useState<number | "">("");




  useEffect(() => {
    const getItemsAndCategories = async () => {
      try {
        const itemsData: Product[] = await fetchApi("platos");
        const categoriesData: Category[] = await fetchApi("categorias");
        setItems(itemsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error al obtener los ítems y categorías:", error);
      }
    };
    getItemsAndCategories();
  }, []);





  const handleDeleteItem = async (itemId: string, categoriaId: string) => {
    const result = await Swal.fire({
      title: "¿Estás seguro que quieres eliminar este producto?",
      text: "¡No hay vuelta atrás!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar"
    });

    if (result.isConfirmed) {
      try {
        await fetchApi(`platos/categorias/${categoriaId}/${itemId}`, "DELETE");
        setItems((prev) => prev.filter((item) => item.id !== itemId));

        await Swal.fire({
          title: "Eliminado",
          text: "Producto eliminado exitosamente.",
          icon: "success"
        });
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        Swal.fire("Error", "No se pudo eliminar el producto.", "error");
      }
    }
  };




  const handleEditItem = async (e: React.FormEvent, itemId: string, categoriaId: string) => {
    e.preventDefault();

    if (!newName || !newPrice || !newCategoryId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "todos los campos deben ser completados",
        footer: '<a href="#">Why do I have this issue?</a>'
      }); return;
    }

    const formData = new FormData()
    formData.append("nombre", newName)
    formData.append("descripcion", newDescription)
    formData.append("precio", String(newPrice))
    formData.append("categoriaId", newCategoryId)
    if (newDiscountPrice !== "") formData.append("precioDescuento", String(newDiscountPrice));

    if (newImage) {
      formData.append("imagen", newImage);
    }
    try {
      const response = await fetchApi(
        `platos/categorias/${categoriaId}/platos/${itemId}`,
        "PATCH",
        formData,
        true
      );

      setItems(items.map((item) => (item.id === itemId ? response : item)));
      Swal.fire({
        title: "Completado!",
        icon: "success",
        text: "producto actualizado exitosamente",
        draggable: true
      });
      setEditItem(null);
    }
    catch (error) {
      console.error("Error al actualizar el producto:", error);
    }
  };

  const handleEditFields = (item: Product) => {
    setEditItem(item);
    setNewName(item.nombre);
    setNewDescription(item.descripcion);
    setNewPrice(item.precio);
    setNewDiscountPrice(item.precioDescuento);
    setNewCategoryId(item.categoriaId);
  };


  const handleAddOption = async (productId: string) => {
    const product = items.find(item => item.id === productId);
    const categoryId = product ? product.categoriaId : null;

    if (!optionName) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "El nombre de la opcion es obligatorio!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    if (!categoryId) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No se encontro la categoria del producto!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
      return;
    }

    try {
      const newOption = {
        nombre: optionName,
        precioExtra: optionExtraPrice || 0,
      };

      await fetchApi(`opciones/categorias/${categoryId}/platos/${productId}/opciones`, "POST", newOption);
      Swal.fire({
        title: "Completado!",
        icon: "success",
        text: "opcion agregada correctamente",
        draggable: true
      }); setOptionName("");
      setOptionExtraPrice("");
      setActiveOptionFormId(null);
    } catch (error) {
      console.error("Error al agregar la opción:", error); Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Hubo un error al agregar la opción!",
        footer: '<a href="#">Why do I have this issue?</a>'
      });
    }
  };


  const deleteOption = async (categoriaId: string, itemId: string, opcionId: string) => {
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
        await fetchApi(`opciones/categorias/${categoriaId}/platos/${itemId}/opciones/${opcionId}`, "DELETE");
      } catch (error) {
        console.error("Error al eliminar la opción:", error);
      }
    }

  }


  const getDetalles = (plato: Product) => {
    setsinglePlato(plato)
    setdetalle(true)

  }

  const goBack = () => {
    setdetalle(false)
    console.log("Volviendo, detalles:", false)
  }



  return (
    <div>
      <h2>Dashboard de Productos</h2>

      {/* Lista de productos */}
      <div className="itemContainer">
        {detalle ? (
          <div className="singleItem">
            <h1>{singlePlato?.nombre}</h1>
            <h3>{singlePlato?.descripcion}</h3>
            <h2>${singlePlato?.precio}</h2>
            <img src={singlePlato?.imagen} alt={singlePlato?.nombre} />
            {singlePlato?.opciones?.map((opc, index) => (
              <li key={index} className="lista">
                <p>{opc.nombre}</p>
                {opc.precio && <p>Precio extra: ${opc.precio}</p>}
                <button className="listBtn" onClick={() => deleteOption(singlePlato.categoriaId, singlePlato.id, opc.id)}
                >
                  borrar
                </button>
              </li>
            ))}


            <button onClick={goBack} className='volverBtn'>Volver</button>

          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="item-card">
              <h3>{item.nombre}</h3>
              <p>{item.descripcion}</p>
              <p>Precio: ${item.precio}</p>
              <p>Precio de Descuento: ${item.precioDescuento}</p>
              <img src={item.imagen} alt={item.nombre} onClick={() => getDetalles(item)} />

              <button onClick={() => handleDeleteItem(item.id, item.categoriaId)}>Eliminar</button>
              <button onClick={() => handleEditFields(item)}>Editar</button>
              <button onClick={() => setActiveOptionFormId(item.id)}>Agregar opción</button>

              {/* Formulario para agregar opción */}
              {activeOptionFormId === item.id && (
                <div style={{ marginTop: "10px" }}>
                  <input
                    type="text"
                    placeholder="Nombre de la opción"
                    value={optionName}
                    onChange={(e) => setOptionName(e.target.value)}
                  />
                  <input
                    type="number"
                    placeholder="Precio extra (opcional)"
                    value={optionExtraPrice}
                    onChange={(e) => setOptionExtraPrice(Number(e.target.value))}
                  />
                  <button onClick={() => handleAddOption(item.id)}>Guardar opción</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Formulario de edición */}
      {editItem && (
        <div className="edit-form">
          <h3>Editar Producto</h3>
          <form onSubmit={(e) => handleEditItem(e, editItem.id, editItem.categoriaId)}>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Descripción"
            />
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(Number(e.target.value))}
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
            <select value={newCategoryId} onChange={(e) => setNewCategoryId(e.target.value)}>
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
      )}
    </div>
  );
};

































