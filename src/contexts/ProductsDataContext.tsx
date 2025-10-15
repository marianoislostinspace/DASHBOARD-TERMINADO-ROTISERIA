import { useState, createContext } from "react"
import { Product, Category } from "../assets/types/types"

interface ProductsContext {
  productsList: Product[],
  categoriesList: Category[],
  initProductList: (productList: Product[]) => void,
  initCategoriesList: (categoriesList: Category[]) => void
}

export const ProductDataContext = createContext<ProductsContext>({
  productsList: [],
  categoriesList: [],
  initCategoriesList: (list : Category[]) => {},
  initProductList: (list : Product[]) => {}
})


export const ProductsDataProvider = ({ children }: { children: React.ReactNode }) => {

    const [productsList, setProductsList] = useState<Product[]>([])
    const [categoriesList, setCategoriesList] = useState<Category[]>([])

    const initCategoriesList = (list : Category[]) => setCategoriesList(list)
    const initProductList = (list : Product[]) => setProductsList(list)
    

  return (
    <ProductDataContext.Provider value={{productsList, categoriesList, initCategoriesList, initProductList}}>
      {children}
    </ProductDataContext.Provider>
  )
}