import axiosClient from "./axiosClient"

const getListApproval = async () => {
     try {
          return await axiosClient.get('application/list')
     } catch (error) {
          console.log(`Error at get list approval: ${error}`)
     }
}

const approveApplication = async (applicationId) => {
     try {
          return await axiosClient.post('application/approve', { applicationId })
     } catch (error) {
          console.log(`Error at aprrove application: ${error}`)
     }
}

const rejectApplication = async (applicationId) => {
     try {
          return await axiosClient.post('application/reject', { applicationId })
     } catch (error) {
          console.log(`Error at reject application: ${error}`)
     }
}

const getAdminAnalysis = async () => {
     try {
          const ADMIN = 'admin'
          const { data: dataSummary } = await axiosClient.get(`${ADMIN}/summary`)
          const { data: allTicketsByMonth } = await axiosClient.get(`${ADMIN}/tickets-by-month`)
          const { data: allTicketsData } = await axiosClient.get(`${ADMIN}/today-tickets`)
          const { data: todayPassengersData } = await axiosClient.get(`${ADMIN}/today-passengers`)
          const { data: todayRevenueData } = await axiosClient.get(`${ADMIN}/today-revenue`)
          const { data: todayDiscountTickets } = await axiosClient.get(`${ADMIN}/today-discount-tickets`)

          return {
               summary: dataSummary,
               allTicketsByMonth,
               allTickets: allTicketsData.ticketsToday,
               allTicketsData,
               todayPassengers: todayPassengersData.passengersToday,
               todayRevenue: todayRevenueData.revenueToday,
               todayDiscountTickets
          }
     } catch (error) {
          console.log(`[api] Error code at get admin analysis: ${error}`)
     }
}
export { getListApproval, approveApplication, rejectApplication, getAdminAnalysis }