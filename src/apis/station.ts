import axiosClient from "./axiosClient"

const getListStation = async () => {
     try {
          return await axiosClient.get('/station')
     } catch (error) {
          console.log(error)
     }
}

export { getListStation }