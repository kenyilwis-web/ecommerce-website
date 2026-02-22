import { useMemo } from 'react'

export function useProductSearch(products, searchTerm, selectedCategory) {
  return useMemo(() => {
    // Derived filtering logic is memoized to avoid recomputation on unrelated renders.
    return products.filter((product) => {
      const categoryMatches =
        selectedCategory === 'all' || Number(selectedCategory) === product.categoryId

      // Build a single searchable string to keep match logic simple and extensible.
      const searchTarget = `${product.name} ${product.description} ${product.origin}`.toLowerCase()
      const searchMatches = searchTarget.includes(searchTerm.trim().toLowerCase())

      return categoryMatches && searchMatches
    })
  }, [products, searchTerm, selectedCategory])
}
