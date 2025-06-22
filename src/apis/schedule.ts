import axiosClient from "./axiosClient"

const getScheduleByDirection = async (direction: string) => {
     return await axiosClient.get(`/schedule/${direction}`)
}

const getScheduleByStartTime = async (dicrection, startTime) => {
     return await axiosClient.get(`schedule/${dicrection}/${startTime}`)
}

export { getScheduleByDirection, getScheduleByStartTime }