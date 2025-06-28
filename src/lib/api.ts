import axios from 'axios'

const API_URL = import.meta.env.VITE_APP_API_URL

export async function purchaseTicket(data) {
  const res = await axios.post(`${API_URL}purchase/ticket`, data)
  return res.data
}

export async function getStations() {
  const res = await axios.get(`${API_URL}station`)
  return res.data
}