import axiosClient from "./axiosClient"

interface TimetableUpdateData {
     start_time?: string;
     title?: string;
     type?: number;
     status?: number;
     date?: string;
}

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

const getStationStatusToday = async () => {
     try {
          const { data } = await axiosClient.get('admin/station-status-today');
          return data;
     } catch (error) {
          console.log(`[api] Error at get station status today: ${error}`)
     }
}
const getListTimetable = async () => {
     try {
          return await axiosClient.get('schedule/timetable')
     } catch (error) {
          console.log(error)
     }
}

const deleteTimetableById = async (id: string) => {
     try {
          return await axiosClient.delete(`schedule/timetable/${id}`)
     } catch (error) {
          console.log(`Error at delete timetable: ${error}`)
          throw error
     }
}

const updateTimetableById = async (id: string, updateData: TimetableUpdateData) => {
     try {
          return await axiosClient.put(`schedule/timetable/${id}`, updateData)
     } catch (error) {
          console.log(`Error at update timetable: ${error}`)
          throw error
     }
}

// Không cần API restoreTimetableById nữa vì chúng ta đang sử dụng updateTimetableById để kích hoạt lại
const restoreTimetableById = async (id: string) => {
     try {
          return await axiosClient.patch(`schedule/timetable/${id}/restore`)
     } catch (error) {
          console.log(`Error at restore timetable: ${error}`)
          throw error
     }
}

const disableUserById = async (userId: string) => {
     try {
          return await axiosClient.patch(`admin/disable-user/${userId}`)
     } catch (error) {
          console.log(`Error at disable user: ${error}`)
          throw error
     }
}

const enableUserById = async (userId: string) => {
     try {
          return await axiosClient.patch(`admin/enable-user/${userId}`)
     } catch (error) {
          console.log(`Error at enable user: ${error}`)
          throw error
     }
}

const getAllUsers = async () => {
  try {
    return await axiosClient.get('admin/users');
  } catch (error) {
    console.log('Error at get all users:', error);
    throw error;
  }
}

export {
     getListApproval,
     approveApplication,
     rejectApplication,
     getAdminAnalysis,
     getListTimetable,
     getStationStatusToday,
     // Giữ lại export cho tương thích ngược với code cũ
     deleteTimetableById,
     updateTimetableById,
     restoreTimetableById,
     disableUserById, // thêm export mới
     enableUserById, // thêm export mới
     getAllUsers
}

