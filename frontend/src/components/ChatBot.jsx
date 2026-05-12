import { useState, useRef, useEffect } from 'react'
import { sendChat } from '../api'

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I\'m TajaBot 🥭 Ask me about our mangoes, prices, or your order status!' }
  ])
  const [input, setInput] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState(null)
  const [showPhoneInput, setShowPhoneInput] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { role: 'user', content: text }
    const history = [...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) > 0), userMsg]
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const { data } = await sendChat(history, phone)
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
      setProvider(data.provider)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I\'m having trouble connecting right now. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        title="Chat with TajaBot"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-amber-100"
          style={{ maxHeight: '520px' }}>

          {/* Header */}
          <div className="bg-amber-500 text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🥭</span>
              <div>
                <p className="font-semibold text-sm">TajaBot</p>
                {provider && (
                  <p className="text-xs text-amber-100">via {provider}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowPhoneInput(p => !p)}
              className="text-xs bg-amber-400 hover:bg-amber-300 px-2 py-1 rounded-lg"
              title="Set phone for order lookup"
            >
              {phone ? `📞 ${phone.slice(-4)}` : '📞 Add phone'}
            </button>
          </div>

          {/* Phone input (collapsible) */}
          {showPhoneInput && (
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-100 flex gap-2">
              <input
                type="tel"
                placeholder="Your phone for order lookup"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="flex-1 text-sm border border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={() => setShowPhoneInput(false)}
                className="text-xs bg-amber-500 text-white px-3 rounded-lg"
              >OK</button>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scrollbar-hide" style={{ minHeight: 0 }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-amber-500 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t px-3 py-3 flex gap-2">
            <input
              type="text"
              placeholder="Ask about mangoes..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-amber-400"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-200 text-white w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
