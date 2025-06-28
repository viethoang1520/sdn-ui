import axiosClient from "./axiosClient"

type Ticket = {
     type: string
     quantity: number
}

const purchaseTicketByType = async ({ userId, tickets } : {userId: string, tickets: Ticket[]}) => {
     try {
          return await axiosClient.post('purchase/type', { userId, tickets })
     } catch (error) {
          console.log(`Error at purchase ticket by type api: ${error}`)
     }
}

const purchaseTicketByRoute = async (routes, userId) => {
     try {
          return await axiosClient.post('purchase/route', {routes, userId})
     } catch (error) {
          console.log(error)
     }
}

export { purchaseTicketByType, purchaseTicketByRoute }