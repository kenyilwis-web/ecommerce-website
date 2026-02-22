import { useEffect, useId, useRef, useState } from 'react'
import { useProducts } from '../context/ProductContext.jsx'

function AdminPage() {
  const { categories, products, addProduct, updateProduct } = useProducts()
  const idPrefix = useId()
  const feedbackTimerRef = useRef(null)

  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    origin: '',
    price: '',
    categoryId: '',
  })
  const [feedbackMessage, setFeedbackMessage] = useState('')
  const [editDrafts, setEditDrafts] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const draftMap = {}

    // Build editable local drafts from server-backed products.
    for (const product of products) {
      draftMap[product.id] = {
        name: product.name,
        origin: product.origin,
        price: product.price,
      }
    }

    setEditDrafts(draftMap)
  }, [products])

  useEffect(() => {
    return () => {
      // Prevent setState on unmounted component from delayed feedback timeout.
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current)
      }
    }
  }, [])

  const showFeedback = (message) => {
    setFeedbackMessage(message)

    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current)
    }

    // Auto-clear transient feedback to keep admin panel clean.
    feedbackTimerRef.current = setTimeout(() => {
      setFeedbackMessage('')
    }, 2500)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleAddProduct = async (event) => {
    event.preventDefault()

    if (!formValues.name || !formValues.description || !formValues.origin || !formValues.price) {
      showFeedback('All product fields are required.')
      return
    }

    try {
      setIsSubmitting(true)
      await addProduct({
        name: formValues.name,
        description: formValues.description,
        origin: formValues.origin,
        price: Number(formValues.price),
        categoryId: Number(formValues.categoryId || categories[0]?.id || 1),
      })

      setFormValues({
        name: '',
        description: '',
        origin: '',
        price: '',
        categoryId: '',
      })
      showFeedback('Product added successfully.')
    } catch {
      showFeedback('Unable to add product. Confirm API server is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditDraft = (productId, fieldName, fieldValue) => {
    // Track per-product edits locally so admins can change multiple cards safely.
    setEditDrafts((currentDrafts) => ({
      ...currentDrafts,
      [productId]: {
        ...currentDrafts[productId],
        [fieldName]: fieldValue,
      },
    }))
  }

  const handleSaveChanges = async (productId) => {
    const draft = editDrafts[productId]

    if (!draft) {
      return
    }

    try {
      setIsSubmitting(true)
      await updateProduct(productId, {
        name: draft.name,
        origin: draft.origin,
        price: Number(draft.price),
      })

      showFeedback(`Product ${productId} updated.`)
    } catch {
      showFeedback('Unable to update product. Confirm API server is running.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="admin-section">
      <div className="admin-login-card">
        <h2>Admin Product Form</h2>
        <form onSubmit={handleAddProduct} className="admin-form">
          <label htmlFor={`${idPrefix}-name`}>Coffee Name</label>
          <input
            id={`${idPrefix}-name`}
            name="name"
            value={formValues.name}
            onChange={handleFormChange}
            type="text"
          />

          <label htmlFor={`${idPrefix}-description`}>Description</label>
          <input
            id={`${idPrefix}-description`}
            name="description"
            value={formValues.description}
            onChange={handleFormChange}
            type="text"
          />

          <label htmlFor={`${idPrefix}-origin`}>Origin</label>
          <input
            id={`${idPrefix}-origin`}
            name="origin"
            value={formValues.origin}
            onChange={handleFormChange}
            type="text"
          />

          <label htmlFor={`${idPrefix}-price`}>Price</label>
          <input
            id={`${idPrefix}-price`}
            name="price"
            value={formValues.price}
            onChange={handleFormChange}
            min="0"
            step="0.01"
            type="number"
          />

          <label htmlFor={`${idPrefix}-categoryId`}>Location</label>
          <select
            id={`${idPrefix}-categoryId`}
            name="categoryId"
            value={formValues.categoryId}
            onChange={handleFormChange}
          >
            <option value="">Select location</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Add Product'}
          </button>
        </form>
        {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
      </div>

      <div className="admin-products-panel">
        <h3>Update Existing Products</h3>
        <div className="admin-products-grid">
          {products.map((product) => (
            <article key={product.id} className="admin-product-card">
              <label>
                Name
                <input
                  type="text"
                  value={editDrafts[product.id]?.name ?? ''}
                  onChange={(event) => handleEditDraft(product.id, 'name', event.target.value)}
                />
              </label>
              <label>
                Origin
                <input
                  type="text"
                  value={editDrafts[product.id]?.origin ?? ''}
                  onChange={(event) => handleEditDraft(product.id, 'origin', event.target.value)}
                />
              </label>
              <label>
                Price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={editDrafts[product.id]?.price ?? 0}
                  onChange={(event) => handleEditDraft(product.id, 'price', event.target.value)}
                />
              </label>
              <button type="button" disabled={isSubmitting} onClick={() => handleSaveChanges(product.id)}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default AdminPage
