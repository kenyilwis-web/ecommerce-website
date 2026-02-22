import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import App from '../App.jsx'
import { ProductProvider } from '../context/ProductContext.jsx'

export function renderApp(initialRoute = '/') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <ProductProvider>
        <App />
      </ProductProvider>
    </MemoryRouter>,
  )
}
