import { NavLink, Outlet } from 'react-router-dom'
import { useProducts } from '../context/ProductContext.jsx'

function MainLayout() {
  const { navLinks } = useProducts()

  return (
    <div className="app-shell">
      <header className="top-nav">
        {navLinks.map((link) => (
          <NavLink
            key={link.id}
            to={link.path}
            className={({ isActive }) =>
              isActive ? 'top-nav__link top-nav__link--active' : 'top-nav__link'
            }
          >
            {link.label}
          </NavLink>
        ))}
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
