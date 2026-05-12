import { createContext, useContext, useReducer, useState } from 'react'

const CartContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const existing = state.find(i => i.id === action.item.id)
      if (existing) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, amount: i.amount + action.item.amount } : i
        )
      }
      return [...state, action.item]
    }
    case 'REMOVE':
      return state.filter(i => i.id !== action.id)
    case 'UPDATE':
      return state.map(i => i.id === action.id ? { ...i, amount: action.amount } : i)
    case 'CLEAR':
      return []
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(reducer, [])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (product, amount = 1) => {
    dispatch({ type: 'ADD', item: { ...product, amount } })
    setIsOpen(true)
  }
  const removeItem = (id) => dispatch({ type: 'REMOVE', id })
  const updateAmount = (id, amount) => {
    if (amount < 1) dispatch({ type: 'REMOVE', id })
    else dispatch({ type: 'UPDATE', id, amount })
  }
  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalKg = items.reduce((s, i) => s + i.amount, 0)
  const totalPrice = items.reduce((s, i) => s + i.price * i.amount, 0)

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, updateAmount, clearCart, totalKg, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
