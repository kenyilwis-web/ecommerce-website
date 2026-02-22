import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from './testUtils.jsx'

function createInitialState() {
  return {
    heroContent: [{ id: 1, title: 'Coffee R Us', tagline: 'The go to store for your coffee needs' }],
    navLinks: [
      { id: 1, label: 'Home', path: '/' },
      { id: 2, label: 'Shop', path: '/shop' },
      { id: 3, label: 'Admin Portal', path: '/admin' },
    ],
    categories: [
      { id: 1, name: 'location 1' },
      { id: 2, name: 'location 2' },
    ],
    products: [
      {
        id: 1,
        name: 'House Blend',
        description: 'Dark roast',
        origin: 'Vietnam',
        price: 12,
        categoryId: 1,
        currency: 'USD',
        inStock: true,
      },
    ],
  }
}

function createApiFetchMock(state) {
  return vi.fn(async (url, options = {}) => {
    const method = options.method ?? 'GET'

    if (method === 'GET' && url.includes('/heroContent')) {
      return { ok: true, json: async () => state.heroContent }
    }

    if (method === 'GET' && url.includes('/navLinks')) {
      return { ok: true, json: async () => state.navLinks }
    }

    if (method === 'GET' && url.includes('/categories')) {
      return { ok: true, json: async () => state.categories }
    }

    if (method === 'GET' && url.includes('/products')) {
      return { ok: true, json: async () => state.products }
    }

    if (method === 'POST' && url.includes('/products')) {
      const body = JSON.parse(options.body)
      const created = { ...body, id: 2 }
      state.products = [...state.products, created]
      return { ok: true, json: async () => created }
    }

    if (method === 'PATCH' && url.includes('/products/1')) {
      const body = JSON.parse(options.body)
      const updated = { ...state.products[0], ...body }
      state.products[0] = updated
      return { ok: true, json: async () => updated }
    }

    return { ok: false, json: async () => ({}) }
  })
}

describe('Admin interactions', () => {
  let state

  beforeEach(() => {
    state = createInitialState()
    global.fetch = createApiFetchMock(state)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('submits admin form and sends POST request', async () => {
    const user = userEvent.setup()
    renderApp('/admin')

    await screen.findByRole('heading', { name: 'Admin Product Form' })

    const submitButton = screen.getByRole('button', { name: 'Add Product' })
    const adminForm = submitButton.closest('form')

    if (!adminForm) {
      throw new Error('Admin form not found.')
    }

    const scopedForm = within(adminForm)

    await user.type(scopedForm.getByLabelText('Coffee Name'), 'Morning Roast')
    await user.type(scopedForm.getByLabelText('Description'), 'Smooth blend')
    await user.type(scopedForm.getByLabelText('Origin'), 'Kenya')
    await user.type(scopedForm.getByLabelText('Price'), '11.25')
    await user.selectOptions(scopedForm.getByLabelText('Location'), '2')

    await user.click(submitButton)

    expect(await screen.findByText('Product added successfully.')).toBeInTheDocument()

    const postCall = global.fetch.mock.calls.find(([, opts]) => opts?.method === 'POST')
    expect(postCall).toBeTruthy()

    const postBody = JSON.parse(postCall[1].body)
    expect(postBody.name).toBe('Morning Roast')
    expect(postBody.price).toBe(11.25)
    expect(postBody.categoryId).toBe(2)
  })

  it('edits a product and sends PATCH request', async () => {
    const user = userEvent.setup()
    renderApp('/admin')

    await screen.findByRole('heading', { name: 'Update Existing Products' })

    const cards = await screen.findAllByRole('article')
    const firstCard = cards[0]

    const priceInput = within(firstCard).getByLabelText('Price')
    await user.clear(priceInput)
    await user.type(priceInput, '15.5')

    await user.click(within(firstCard).getByRole('button', { name: 'Save Changes' }))

    expect(await screen.findByText('Product 1 updated.')).toBeInTheDocument()

    const patchCall = global.fetch.mock.calls.find(([, opts]) => opts?.method === 'PATCH')
    expect(patchCall).toBeTruthy()

    const patchBody = JSON.parse(patchCall[1].body)
    expect(patchBody.price).toBe(15.5)
  })
})
