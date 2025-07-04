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
          const { data } = await axiosClient.get('admin/today-total-summary');
          return data;
     } catch (error) {
          console.log(`[api] Error code at get admin analysis: ${error}`)
     }
}
export { getListApproval, approveApplication, rejectApplication, getAdminAnalysis }