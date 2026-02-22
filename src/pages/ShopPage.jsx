import { useEffect, useId, useRef, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { useProductSearch } from '../hooks/useProductSearch.js'

function ShopPage() {
  const { categories, products, loading, error } = useProducts()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const searchInputId = useId()
  const searchInputRef = useRef(null)

  const filteredProducts = useProductSearch(products, searchTerm, selectedCategory)

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  return (
    <section className="shop-layout">
      <aside className="shop-sidebar">
        <label htmlFor={searchInputId}>Search</label>
        <input
          id={searchInputId}
          ref={searchInputRef}
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />

        <p className="shop-sidebar__heading">Filter by location</p>
        <ul>
          <li>
            <button
              type="button"
              className={selectedCategory === 'all' ? 'active' : ''}
              onClick={() => setSelectedCategory('all')}
            >
              All locations
            </button>
          </li>
          {categories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                className={Number(selectedCategory) === category.id ? 'active' : ''}
                onClick={() => setSelectedCategory(String(category.id))}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="shop-main">
        {loading && <p>Loading products...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && <p className="results-count">{filteredProducts.length} products found</p>}

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ShopPage
