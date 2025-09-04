import { Interface } from "node:readline";

export interface Option {
  id: string
  nombre: string;
  precio?: number; // Opcional
}

export  interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioDescuento: number;
  imagen: string;
  opciones: Option[]
  categoriaId: string;
}

export interface Category {
  id: string;
  nombre: string;
  imagen: string;
}

export interface Pedido {
  id: string;
  cliente: {
    nombre: string;
    telefono: number;
  };
  total: number;
  items: {
    idPlato: string;
    nombre: string;
    precio: number;
    cantidad: number
    opcionesSeleccionadas: {
      id: string,
      nombre: string,
      precioExtra: number
    }[];
    nota: string;
  }[];
  fecha: number;
  pedidoId: string;
};