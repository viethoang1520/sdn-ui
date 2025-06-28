import axiosClient from "./axiosClient";
import axios from "axios";

export const login = async (loginData) => {
  try {
    const {username, password} = loginData
    return await axios.post(`${import.meta.env.VITE_APP_API_URL}/login/validate`, {
      username, password
    }) 
  } catch (error) {
    console.log(error)    
  }
}

export const register = async (registerData) => {
  try {
    const { username, password, fullName } = registerData
    const data = await axios.post(`${import.meta.env.VITE_APP_API_URL}/register/validate`, {
      username, password, full_name: fullName
    })
    return data
  } catch (error) {
    console.log(error)
  }
}