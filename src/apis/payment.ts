import axiosClient from "./axiosClient"

const payment = async ({ items, transaction_id, total_price }) => {
     try {
          return axiosClient.post('payment/create-payment', { items, transaction_id, total_price })
     } catch (error) {
          console.log(error)
     }
}

export { payment }