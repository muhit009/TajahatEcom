import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { createOrder } from '../api'

export default function Checkout() {
  const { items, totalKg, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', address: '', phone: '', transaction_id: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (items.length === 0) return
    setLoading(true)
    setError(null)

    const payload = {
      name: form.name,
      address: form.address,
      phone: form.phone,
      transaction_id: form.transaction_id,
      order_status: 'processing',
      confirmation_status: false,
      total_amount: totalKg,
      total_price: totalPrice,
      order_list: items.map(i => ({ id: i.id, amount: i.amount, price: i.price })),
    }

    try {
      await createOrder(payload)
      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.errors || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
        <div className="text-7xl">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900">Order Placed!</h1>
        <p className="text-gray-500">
          Thank you for your order. We'll confirm it shortly on your phone number.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center flex flex-col items-center gap-4">
        <span className="text-6xl">🛒</span>
        <p className="text-gray-500 text-lg">Your cart is empty.</p>
        <Link to="/" className="text-amber-600 hover:underline font-medium">← Go shopping</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-5 shadow-sm sticky top-20">
            <h2 className="font-semibold text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.display_name} × {item.amount}kg</span>
                  <span className="font-medium">৳{(item.price * item.amount).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total ({totalKg}kg)</span>
              <span className="text-amber-700">৳{totalPrice.toFixed(0)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="font-semibold text-gray-900">Delivery Details</h2>

            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Abdul Muhit' },
              { label: 'Phone', name: 'phone', type: 'tel', placeholder: '01712345678' },
              { label: 'Delivery Address', name: 'address', type: 'text', placeholder: 'House 12, Road 5, Dhaka' },
              { label: 'Transaction ID', name: 'transaction_id', type: 'text', placeholder: 'bKash / Nagad transaction ID' },
            ].map(field => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  required
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
              {typeof error === 'string' ? error : JSON.stringify(error)}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
          >
            {loading ? 'Placing Order...' : `Place Order — ৳${totalPrice.toFixed(0)}`}
          </button>
        </form>
      </div>
    </div>
  )
}
