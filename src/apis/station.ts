import axiosClient from "./axiosClient"

// Interface cho station
interface Station {
     _id: string;
     name: string;
     route: string;
     prev_station: string;
     next_station: string;
     distance: number;
     status: number;
}

// Lấy danh sách tất cả các station
const getListStation = async (): Promise<Station[]> => {
     try {
          const response = await axiosClient.get('/station');
          return response.data;
     } catch (error) {
          console.error("Error fetching stations:", error);
          throw error;
     }
}

const getListAllStation = async () => {
     try {
          const response = await axiosClient.get('/station/all');
          return response.data;
     } catch (error) {
          console.error("Error fetching all stations:", error);
          throw error;
     }
}

// Tạo station mới
const insertStationByPosition = async (name, distance, insertPosition, referenceStationName) => {
     try {
          const response = await axiosClient.post('/station', {
               name,
               distance,
               insertPosition,
               referenceStationName,
               status: 1
          });
          return response.data;
     } catch (error) {
          console.error("Error creating first station:", error);
          throw error;

     }
}

const insertStationBetween = async (name, distance, insertPosition, prevStationName, nextStationName) => {
     try {
          console.log('Axios:', prevStationName, nextStationName);
          const response = await axiosClient.post('/station', {
               name,
               distance,
               insertPosition,
               insertBetween: {
                    prevStationName,
                    nextStationName
               },
               status: 1
          });
          return response.data;
     } catch (error) {
          console.error("Error creating first station:", error);
          throw error;

     }
}

const updateStationStatus = async (id, status) => {
     try {
          const response = await axiosClient.put(`/station/${id}`, {
               status
          })
          return response.data
     } catch (error) {
          console.error("Error updating station status:", error)
          throw error
     }
}

const renameStation = async (id: string, name: string) => {
     try {
          const response = await axiosClient.put(`/station`, {
               id,
               name
          });
          return response.data;
     } catch (error) {
          console.error("Error renaming station:", error);
          throw error;
     }
}

export type { Station };
export { getListStation, insertStationByPosition, insertStationBetween, updateStationStatus, renameStation, getListAllStation }