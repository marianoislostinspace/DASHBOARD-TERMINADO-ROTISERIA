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

