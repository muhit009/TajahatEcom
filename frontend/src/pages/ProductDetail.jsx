import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProducts, getRecommendations } from '../api'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const { addItem } = useCart()

  const [product, setProduct] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [amount, setAmount] = useState(1)
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    setLoading(true)
    setAdded(false)
    // Fetch all products and find the one with matching id
    getProducts()
      .then(res => {
        const found = res.data.find(p => p.id === parseInt(id))
        setProduct(found || null)
        return getRecommendations(id)
      })
      .then(res => setRecommendations(res.data.recommendations || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const handleAdd = () => {
    addItem({ id: product.id, display_name: product.display_name, price: product.price, img: product.img }, amount)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square bg-amber-100 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-2/3" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">Product not found.</p>
        <Link to="/" className="mt-4 inline-block text-amber-600 hover:underline">← Back to shop</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link to="/" className="hover:text-amber-600">Home</Link>
        <span>›</span>
        <span className="text-gray-700 font-medium">{product.display_name}</span>
      </nav>

      {/* Product section */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* Image */}
        <div className="bg-amber-100 rounded-2xl overflow-hidden aspect-square">
          {product.img
            ? <img src={product.img} alt={product.display_name} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-9xl">🥭</div>
          }
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.display_name}</h1>
            <p className="text-sm text-gray-400 mt-1">Variety: <span className="capitalize">{product.name}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-amber-700">৳{product.price}</span>
            <span className="text-gray-500 text-lg">/ kg</span>
          </div>

          <span className={`w-fit text-sm font-medium px-3 py-1 rounded-full ${
            product.availability ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
          }`}>
            {product.availability ? '✓ In Stock' : '✗ Out of Stock'}
          </span>

          {/* Amount picker */}
          <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">Quantity (kg)</span>
            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-2 py-1">
              <button onClick={() => setAmount(a => Math.max(1, a - 1))}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold text-lg">−</button>
              <span className="w-8 text-center font-bold">{amount}</span>
              <button onClick={() => setAmount(a => a + 1)}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-900 font-bold text-lg">+</button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <span>Subtotal:</span>
            <span className="font-bold text-gray-800 text-base">৳{(product.price * amount).toFixed(0)}</span>
          </div>

          <button
            disabled={!product.availability}
            onClick={handleAdd}
            className={`py-3 rounded-xl font-semibold text-white transition-all ${
              added
                ? 'bg-green-500'
                : 'bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
            }`}
          >
            {added ? '✓ Added to Cart' : product.availability ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>

      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You might also like</h2>
          <p className="text-sm text-gray-400 mb-6 flex items-center gap-1">
            <span>✨</span> AI-powered recommendations
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map(rec => (
              <ProductCard
                key={rec.product_id}
                product={{
                  id: rec.product_id,
                  display_name: rec.name,
                  name: rec.name,
                  price: rec.price,
                  img: null,
                  availability: rec.availability,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
