import { useProducts } from '../context/ProductContext.jsx'

function HomePage() {
  const { heroContent } = useProducts()

  const hero = heroContent[0] ?? {
    title: 'Coffee R Us',
    tagline: 'The go to store for your coffee needs',
  }

  return (
    <section className="hero-panel">
      <h1>{hero.title}</h1>
      <p>{hero.tagline}</p>
    </section>
  )
}

export default HomePage
