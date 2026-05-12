import { useEffect, useState } from 'react'
import { getProducts } from '../api'
import ProductCard from '../components/ProductCard'

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-amber-100" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-2/3" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-200 rounded-xl" />
      </div>
    </div>
  )
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products. Is the Django server running?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-400 to-yellow-300 text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center text-center gap-4">
          <span className="text-7xl drop-shadow">🥭</span>
          <h1 className="text-4xl sm:text-5xl font-bold drop-shadow-sm">
            Premium Bangladeshi Mangoes
          </h1>
          <p className="text-amber-100 text-lg max-w-xl">
            Hand-picked, farm-fresh mango varieties delivered straight to your door.
            Powered by AI to help you find the perfect mango.
          </p>
          <a href="#products"
            className="mt-2 bg-white text-amber-700 font-semibold px-8 py-3 rounded-full hover:bg-amber-50 transition-colors shadow"
          >
            Shop Now
          </a>
        </div>
      </div>

      {/* Products */}
      <div id="products" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Varieties</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map(p => <ProductCard key={p.id} product={p} />)
          }
        </div>

        {!loading && products.length === 0 && !error && (
          <p className="text-center text-gray-400 py-16">No products found.</p>
        )}
      </div>
    </div>
  )
}
