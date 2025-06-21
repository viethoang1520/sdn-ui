import axios from "axios"

const axiosClient = (token) => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
    headers: {
      Authorization: token
    }
  })

  instance.interceptors.response.use(
    response => response.data,
    (error) => {
      return Promise.reject(error)
    }
  )

  return instance
}

export default axiosClient