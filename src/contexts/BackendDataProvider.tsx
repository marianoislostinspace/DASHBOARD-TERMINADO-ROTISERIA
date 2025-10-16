// 
//  La idea es agregar acá todos los Providers correspondientes que correspondan 
//  a contextos que usan información de la base de datos de la página.
//  Automáticamente se agregan a main.tsx para que la info sea accesible a toda
//  la página.
// 

import { PedidoProvider } from "./PedidoContext"
import { ProductsProvider } from "./ProductsContext"
import { CategoriesProvider } from "./CategoriesContext"


export const BackendDataProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <PedidoProvider>
      <CategoriesProvider>
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </CategoriesProvider>
    </PedidoProvider>
  )
}
