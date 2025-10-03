import { State } from "../../hooks/useStateManager";

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioDescuento: number;
  imagen: string;
  opciones: OrderOption[]
  categoriaId: string;
}

export interface Category {
  id: string;
  nombre: string;
  imagen: string;
}

export interface OrderOption {
  id: string
  nombre: string;
  precio?: number; // Opcional
}

export interface OrderItem {
  idPlato: string;
  nombre: string;
  precio: number;
  cantidad: number;
  opcionesSeleccionadas: OrderOption[];
  nota: string;
}
export type Pedido = {
  id: string;
  pedidoId: string;
  cliente: { nombre: string; telefono: number };
  items: OrderItem[];
  total: number;
  fecha: number;
  state: State;
};