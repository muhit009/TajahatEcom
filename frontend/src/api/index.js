import axios from 'axios'

const api = axios.create({ baseURL: '' })

export const getProducts = () => api.get('/product/')

export const getRecommendations = (productId, topN = 3) =>
  api.get(`/ai/recommendations/${productId}/`, { params: { top_n: topN } })

export const createOrder = (orderData) => api.post('/order/', orderData)

export const sendChat = (messages, phone = '') =>
  api.post('/ai/chat/', { messages, phone })
