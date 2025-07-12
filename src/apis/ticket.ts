import axiosClient from "./axiosClient"

type Ticket = {
     type: string
     quantity: number
}

const purchaseTicketByType = async ({ userId, tickets, confirm }: { userId: string, tickets: Ticket[], confirm: boolean }) => {
     try {
          return await axiosClient.post('purchase/type', { userId, tickets, confirm })
     } catch (error) {
          console.log(`Error at purchase ticket by type api: ${error}`)
     }
}

const purchaseTicketByRoute = async (routes, userId, confirm) => {
     try {
          return await axiosClient.post('purchase/route', { routes, userId, confirm })
     } catch (error) {
          console.log(error)
     }
}

const checkinStation = async (ticketId, stationId) => {
     try {
          return await axiosClient.post('ticket/checkin', { ticketId, stationId })
     } catch (error) {
          console.log(error)
     }
}

const checkoutStation = async (ticketId, stationId) => {
     try {
          return await axiosClient.post('ticket/checkout', { ticketId, stationId })
     } catch (error) {
          console.log(error)
     }
}

export { purchaseTicketByType, purchaseTicketByRoute, checkinStation, checkoutStation }