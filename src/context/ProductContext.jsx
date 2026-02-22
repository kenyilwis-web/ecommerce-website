import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { createProduct, fetchInitialData, patchProduct } from '../services/productApi.js'

const ProductContext = createContext(null)

const defaultNavLinks = [
  { id: 1, label: 'Home', path: '/' },
  { id: 2, label: 'Shop', path: '/shop' },
  { id: 3, label: 'Admin Portal', path: '/admin' },
]

export function ProductProvider({ children }) {
  // Global app state shared by all routed pages.
  const [heroContent, setHeroContent] = useState([])
  const [navLinks, setNavLinks] = useState(defaultNavLinks)
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      setError('')

      try {
        // Hydrate layout and product data before interactive actions are used.
        const { heroContent: heroData, navLinks: navData, categories: categoriesData, products: productsData } =
          await fetchInitialData()

        setHeroContent(heroData ?? [])
        setNavLinks(navData ?? defaultNavLinks)
        setCategories(categoriesData ?? [])
        setProducts(productsData ?? [])
      } catch {
        setError('Could not fetch product data. Start the API with npm run api and retry.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const addProduct = async (newProduct) => {
    // Persist first, then merge into local state so UI reflects server truth.
    const createdProduct = await createProduct(newProduct)
    setProducts((currentProducts) => [...currentProducts, createdProduct])
    return createdProduct
  }

  const updateProduct = async (id, updates) => {
    // Keep state updates immutable for predictable React re-rendering.
    const updatedProduct = await patchProduct(id, updates)
    setProducts((currentProducts) => {
      return currentProducts.map((product) => {
        return product.id === id ? updatedProduct : product
      })
    })

    return updatedProduct
  }

  const contextValue = useMemo(() => {
    // Memoize context value to avoid unnecessary renders in consumers.
    return {
      heroContent,
      navLinks,
      categories,
      products,
      loading,
      error,
      addProduct,
      updateProduct,
    }
  }, [heroContent, navLinks, categories, products, loading, error])

  return <ProductContext.Provider value={contextValue}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('useProducts must be used inside ProductProvider.')
  }

  return context
}
