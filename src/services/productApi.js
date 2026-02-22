const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

async function fetchJson(url, options) {
  // Centralized fetch wrapper so all API calls share the same error behavior.
  const response = await fetch(url, options)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json()
}

export async function fetchInitialData() {
  // Load independent datasets concurrently to reduce initial page wait time.
  const [heroContent, navLinks, categories, products] = await Promise.all([
    fetchJson(`${API_BASE_URL}/heroContent`),
    fetchJson(`${API_BASE_URL}/navLinks`),
    fetchJson(`${API_BASE_URL}/categories`),
    fetchJson(`${API_BASE_URL}/products`),
  ])

  return {
    heroContent,
    navLinks,
    categories,
    products,
  }
}

export async function createProduct(newProduct) {
  // The backend expects normalized product defaults; keep them in one place.
  const payload = {
    inStock: true,
    currency: 'USD',
    ...newProduct,
  }

  return fetchJson(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}

export async function patchProduct(id, updates) {
  // PATCH only sends fields that changed from the admin edit form.
  return fetchJson(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  })
}
