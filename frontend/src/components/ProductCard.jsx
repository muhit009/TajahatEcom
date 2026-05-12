import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { id, display_name, price, img, availability } = product

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
      <Link to={`/product/${id}`}>
        <div className="bg-amber-100 aspect-square overflow-hidden">
          {img ? (
            <img
              src={img}
              alt={display_name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-7xl">🥭</div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to={`/product/${id}`}>
          <h3 className="font-semibold text-lg text-gray-900 hover:text-amber-700 transition-colors">
            {display_name}
          </h3>
        </Link>

        <div className="flex items-center justify-between mt-1 mb-3">
          <span className="text-amber-700 font-bold text-lg">৳{price}/kg</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            availability
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-600'
          }`}>
            {availability ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        <button
          disabled={!availability}
          onClick={() => addItem({ id, display_name, price, img }, 1)}
          className="mt-auto w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 rounded-xl transition-colors"
        >
          {availability ? 'Add to Cart' : 'Unavailable'}
        </button>
      </div>
    </div>
  )
}
