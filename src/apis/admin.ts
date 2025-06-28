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

export { getListApproval, approveApplication, rejectApplication }