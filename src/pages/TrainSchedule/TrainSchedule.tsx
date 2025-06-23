import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Train } from "lucide-react";
import { useEffect, useState } from "react";
import DepartureTimes from "./components/DepartureTimes";
import DirectionSelector from "./components/DirectionSelector";
import ScheduleDetailsDialog from "./components/ScheduleDetailsDialog";
import { getScheduleByDirection, getScheduleByStartTime } from "@/apis/schedule";

interface Station {
  id: string;
  name: string;
  nameEn: string;
}

const TrainSchedule = () => {
  const [selectedDirection, setSelectedDirection] = useState<string>("")
  const [scheduleData, setScheduleData] = useState([])
  const [selectedSchedule, setSelectedSchedule] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [language, setLanguage] = useState<"vi" | "en">("vi")

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDirection) {
        const { data } = await getScheduleByDirection(selectedDirection)
        if (data.errorCode == 0) {
          setScheduleData(data.route)
        }
      }
    }
    fetchData()
  }, [selectedDirection])

  // Mock data for stations
  const stations: Station[] = [
    { id: "bt", name: "Bến Thành", nameEn: "Ben Thanh" },
    { id: "nha-hat", name: "Nhà hát Thành phố", nameEn: "Opera House" },
    { id: "ba-son", name: "Ba Son", nameEn: "Ba Son" },
    { id: "van-thanh", name: "Văn Thánh", nameEn: "Van Thanh" },
    { id: "tan-cang", name: "Tân Cảng", nameEn: "Tan Cang" },
    { id: "thu-thiem", name: "Thủ Thiêm", nameEn: "Thu Thiem" },
    { id: "an-phu", name: "An Phú", nameEn: "An Phu" },
    { id: "rach-chiec", name: "Rạch Chiếc", nameEn: "Rach Chiec" },
    { id: "phuoc-long", name: "Phước Long", nameEn: "Phuoc Long" },
    { id: "binh-thai", name: "Bình Thái", nameEn: "Binh Thai" },
    { id: "truong-tho", name: "Trường Thọ", nameEn: "Truong Tho" },
    { id: "hiep-phu", name: "Hiệp Phú", nameEn: "Hiep Phu" },
    { id: "long-binh", name: "Long Bình", nameEn: "Long Binh" },
    { id: "suoi-tien", name: "Suối Tiên", nameEn: "Suoi Tien" },
  ];

  const translations = {
    vi: {
      title: "Lịch Trình Tàu Metro",
      subtitle:
        "Xem lịch trình chi tiết các chuyến tàu Metro Bến Thành - Suối Tiên",
      selectDirection: "Chọn hướng tuyến",
      benThanhToSuoiTien: "Bến Thành → Suối Tiên",
      suoiTienToBenThanh: "Suối Tiên → Bến Thành",
      departureTime: "Giờ khởi hành",
      selectTime: "Chọn giờ để xem chi tiết",
      scheduleDetails: "Chi tiết lịch trình",
      station: "Trạm",
      arrivalTime: "Giờ đến dự kiến",
      close: "Đóng",
      noDirection: "Vui lòng chọn hướng tuyến",
    },
    en: {
      title: "Metro Train Schedule",
      subtitle:
        "View detailed schedules for Ben Thanh - Suoi Tien Metro Line trains",
      selectDirection: "Select Direction",
      benThanhToSuoiTien: "Ben Thanh → Suoi Tien",
      suoiTienToBenThanh: "Suoi Tien → Ben Thanh",
      departureTime: "Departure Time",
      selectTime: "Select time to view details",
      scheduleDetails: "Schedule Details",
      station: "Station",
      arrivalTime: "Estimated Arrival",
      close: "Close",
      noDirection: "Please select a direction",
    },
  };

  const t = translations[language];

  const getStationName = (stationId: string) => {
    const station = stations.find((s) => s.id === stationId);
    return station
      ? language === "vi"
        ? station.name
        : station.nameEn
      : stationId;
  };

  const handleTimeClick = (schedule) => {
    const fetchData = async () => {
      const { data } = await getScheduleByStartTime(selectedDirection, schedule)
      console.log(data)
      setSelectedSchedule(data.arrivalTimeList)
    }
    fetchData()
    setIsDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#003087] text-white py-8">
        <div className="container">
          <div className="flex items-center gap-3 mb-4">
            <Train className="h-8 w-8" />
            <h1 className="text-2xl md:text-3xl font-bold">{t.title}</h1>
          </div>
          <p className="text-white/80 text-lg">{t.subtitle}</p>
        </div>
      </div>

      <div className="container py-8">
        {/* Direction Selection */}
        <DirectionSelector
          t={t}
          selectedDirection={selectedDirection}
          setSelectedDirection={setSelectedDirection}
        />

        {/* Departure Times */}
        {selectedDirection ? (
          <DepartureTimes
            t={t}
            schedules={scheduleData}
            handleTimeClick={handleTimeClick}
          />
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Train className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg text-muted-foreground">{t.noDirection}</p>
            </CardContent>
          </Card>
        )}
        <ScheduleDetailsDialog
          t={t}
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
          selectedSchedule={selectedSchedule}
          selectedDirection={selectedDirection}
          getStationName={getStationName}
        />
      </div>
    </div>
  )
}

export default TrainSchedule
