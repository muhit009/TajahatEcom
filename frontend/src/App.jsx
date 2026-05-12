import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Cart from './components/Cart'
import ChatBot from './components/ChatBot'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Checkout from './pages/Checkout'

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Cart />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
        <ChatBot />
      </BrowserRouter>
    </CartProvider>
  )
}
