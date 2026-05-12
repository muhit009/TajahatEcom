import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, isOpen, setIsOpen, removeItem, updateAmount, totalKg, totalPrice } = useCart()
  const navigate = useNavigate()

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
              <span className="text-5xl">🛒</span>
              <p className="font-medium">Your cart is empty</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center gap-3 bg-amber-50 rounded-xl p-3">
                <div className="w-14 h-14 bg-amber-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.img
                    ? <img src={item.img} alt={item.display_name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-2xl">🥭</div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.display_name}</p>
                  <p className="text-amber-700 text-sm font-semibold">৳{item.price}/kg</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateAmount(item.id, item.amount - 1)}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50"
                  >−</button>
                  <span className="w-6 text-center font-semibold text-sm">{item.amount}</span>
                  <button
                    onClick={() => updateAmount(item.id, item.amount + 1)}
                    className="w-7 h-7 rounded-full bg-white border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-gray-50"
                  >+</button>
                </div>

                <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 ml-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Total weight</span>
              <span className="font-medium">{totalKg} kg</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-amber-700">৳{totalPrice.toFixed(0)}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); navigate('/checkout') }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  )
}
