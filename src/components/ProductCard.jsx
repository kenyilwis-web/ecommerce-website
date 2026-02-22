function ProductCard({ product }) {
  return (
    <article className="product-card">
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>
        <strong>Origin:</strong> {product.origin}
      </p>
      <p>
        <strong>Price:</strong> ${Number(product.price).toFixed(2)}
      </p>
    </article>
  )
}

export default ProductCard
