import axiosClient from "./axiosClient";
import axios from "axios";

export const login = async (loginData) => {
  try {
    const {username, password} = loginData
    return await axios.post('http://localhost:3000/login/validate', {
      username, password
    }) 
  } catch (error) {
    console.log(error)    
  }
}

export const register = async (registerData) => {
  try {
    const { username, password, fullname } = registerData
    const data = await axios.post('http://localhost:3000/register/validate', {
      username, password, fullname
    })
    return data
  } catch (error) {
    console.log(error)
  }
}