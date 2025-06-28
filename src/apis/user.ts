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

const getUserPurchaseHistory = async (userId: string) => {
     try {
          return await axiosClient.get(`/ticket/user/${userId}`)
     } catch (error) {
          console.log(`Error at getUserPurchaseHistory: ${error}`)
     }
}

const getUserActiveTickets = async (userId: string) => {
     try {
          return await axiosClient.get(`/ticket/active/${userId}`)
     } catch (error) {
          console.log(`Error at getUserActiveTickets: ${error}`)
     }
}


export { getUserInformation, updateUserInformation, getUserPurchaseHistory, getUserActiveTickets }