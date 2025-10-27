import { State } from "../../hooks/useStateManager";

export interface ProductOption {
  id: string
  nombre: string;
  precio: number | undefined; // Opcional
}

export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  precioDescuento: number;
  imagen: string;
  opciones: ProductOption[]
  categoriaId: string;
  esVisible: boolean;
}

export interface Category {
  id: string;
  nombre: string;
  imagen: string;
}

export interface OrderItem {
  idPlato: string;
  nombre: string;
  precio: number;
  cantidad: number;
  opcionesSeleccionadas: ProductOption[];
  nota: string;
}
export type Pedido = {
  id: string;
  cliente: { nombre: string; telefono: number };
  items: OrderItem[];
  total: number;
  fecha: number;
  state: State;
  estaArchivado: boolean;
};