import axiosClient from "./axiosClient"

const getScheduleByDirection = async (direction: string) => {
     return (await axiosClient.get(`/schedule/${direction}`))
}

export { getScheduleByDirection }