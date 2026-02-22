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
    },
    {
      id: 2,
      name: 'Morning Roast',
      description: 'Smooth medium roast',
      origin: 'Kenya',
      price: 11,
      categoryId: 2,
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

describe('Shop interactions', () => {
  beforeEach(() => {
    global.fetch = createFetchMock()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('filters products by search term and location', async () => {
    const user = userEvent.setup()

    renderApp('/shop')

    expect(await screen.findByText('2 products found')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Search'), 'morning')
    expect(await screen.findByText('1 products found')).toBeInTheDocument()
    expect(screen.getByText('Morning Roast')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Search'))
    await user.click(screen.getByRole('button', { name: 'location 1' }))

    expect(await screen.findByText('1 products found')).toBeInTheDocument()
    expect(screen.getByText('House Blend')).toBeInTheDocument()
  })
})
