import type { AxiosError, AxiosResponse } from 'axios'
import axios from "axios"

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL as string,
  headers: { }
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

export default axiosClient