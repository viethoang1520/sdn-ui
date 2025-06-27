import axiosClient from "./axiosClient"

const getListStation = async () => {
     return await axiosClient.get('/station')
}

export { getListStation }