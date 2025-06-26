import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export async function purchaseTicket(data: any) {
  const res = await axios.post(`${API_URL}/purchase/ticket`, data);
}

export async function getStations() {
  const res = await axios.get(`${API_URL}/station`);
  return res.data;
}