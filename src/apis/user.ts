import axiosClient from "./axiosClient"

const getUserInformation = async () => {
     try {
          return await axiosClient.get('/user')
     } catch (error) {
          console.log(`Error at getUserInformation apis: ${error}`)
     }
}

const updateUserInformation = async (user) => {
     try {
          return await axiosClient.post('/user/update', user)
     } catch (error) {
          console.log(`Error at updateUserInformation: ${error}`)
     }
}

export { getUserInformation, updateUserInformation }