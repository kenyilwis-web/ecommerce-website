import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderApp } from './testUtils.jsx'

const mockData = {
  heroContent: [{ id: 1, title: 'Coffee R Us', tagline: 'The go to store for your coffee needs' }],
  navLinks: [
    { id: 1, label: 'Home', path: '/' },
    { id: 2, label: 'Shop', path: '/shop' },
    { id: 3, label: 'Admin Portal', path: '/admin' },
  ],
  categories: [{ id: 1, name: 'location 1' }],
  products: [
    {
      id: 1,
      name: 'House Blend',
      description: 'Dark roast',
      origin: 'Vietnam',
      price: 12,
      categoryId: 1,
    },
  ],
}

function createFetchMock() {
  return vi.fn((url) => {
    if (url.includes('/heroContent')) {
      return Promise.resolve({ ok: true, json: async () => mockData.heroContent })
    }
    if (url.includes('/navLinks')) {
      return Promise.resolve({ ok: true, json: async () => mockData.navLinks })
    }
    if (url.includes('/categories')) {
      return Promise.resolve({ ok: true, json: async () => mockData.categories })
    }
    if (url.includes('/products')) {
      return Promise.resolve({ ok: true, json: async () => mockData.products })
    }

    return Promise.resolve({ ok: false, json: async () => ({}) })
  })
}

describe('App routing', () => {
  beforeEach(() => {
    global.fetch = createFetchMock()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('navigates between home, shop, and admin routes from top nav', async () => {
    const user = userEvent.setup()

    renderApp('/')

    expect(await screen.findByRole('heading', { name: 'Coffee R Us' })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Shop' }))
    expect(await screen.findByText(/products found/i)).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: 'Admin Portal' }))
    expect(await screen.findByRole('heading', { name: 'Admin Product Form' })).toBeInTheDocument()
  })
})
