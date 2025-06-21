import React, { useState } from "react";
import { Clock, ArrowRight, Train } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DirectionSelector from "./components/DirectionSelector";
import DepartureTimes from "./components/DepartureTimes";
import ScheduleDetailsDialog from "./components/ScheduleDetailsDialog";

interface Station {
  id: string;
  name: string;
  nameEn: string;
}

interface ScheduleEntry {
  stationId: string;
  arrivalTime: string;
}

interface TrainSchedule {
  departureTime: string;
  stations: ScheduleEntry[];
}

const TrainSchedule = () => {
  const [selectedDirection, setSelectedDirection] = useState<string>("");
  const [selectedSchedule, setSelectedSchedule] =
    useState<TrainSchedule | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [language, setLanguage] = useState<"vi" | "en">("vi");

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

  // Mock schedule data
  const scheduleData = {
    "ben-thanh-to-suoi-tien": [
      {
        departureTime: "05:30",
        stations: [
          { stationId: "bt", arrivalTime: "05:30" },
          { stationId: "nha-hat", arrivalTime: "05:33" },
          { stationId: "ba-son", arrivalTime: "05:36" },
          { stationId: "van-thanh", arrivalTime: "05:39" },
          { stationId: "tan-cang", arrivalTime: "05:42" },
          { stationId: "thu-thiem", arrivalTime: "05:45" },
          { stationId: "an-phu", arrivalTime: "05:48" },
          { stationId: "rach-chiec", arrivalTime: "05:51" },
          { stationId: "phuoc-long", arrivalTime: "05:54" },
          { stationId: "binh-thai", arrivalTime: "05:57" },
          { stationId: "truong-tho", arrivalTime: "06:00" },
          { stationId: "hiep-phu", arrivalTime: "06:03" },
          { stationId: "long-binh", arrivalTime: "06:06" },
          { stationId: "suoi-tien", arrivalTime: "06:10" },
        ],
      },
      {
        departureTime: "05:45",
        stations: [
          { stationId: "bt", arrivalTime: "05:45" },
          { stationId: "nha-hat", arrivalTime: "05:48" },
          { stationId: "ba-son", arrivalTime: "05:51" },
          { stationId: "van-thanh", arrivalTime: "05:54" },
          { stationId: "tan-cang", arrivalTime: "05:57" },
          { stationId: "thu-thiem", arrivalTime: "06:00" },
          { stationId: "an-phu", arrivalTime: "06:03" },
          { stationId: "rach-chiec", arrivalTime: "06:06" },
          { stationId: "phuoc-long", arrivalTime: "06:09" },
          { stationId: "binh-thai", arrivalTime: "06:12" },
          { stationId: "truong-tho", arrivalTime: "06:15" },
          { stationId: "hiep-phu", arrivalTime: "06:18" },
          { stationId: "long-binh", arrivalTime: "06:21" },
          { stationId: "suoi-tien", arrivalTime: "06:25" },
        ],
      },
      {
        departureTime: "06:00",
        stations: [
          { stationId: "bt", arrivalTime: "06:00" },
          { stationId: "nha-hat", arrivalTime: "06:03" },
          { stationId: "ba-son", arrivalTime: "06:06" },
          { stationId: "van-thanh", arrivalTime: "06:09" },
          { stationId: "tan-cang", arrivalTime: "06:12" },
          { stationId: "thu-thiem", arrivalTime: "06:15" },
          { stationId: "an-phu", arrivalTime: "06:18" },
          { stationId: "rach-chiec", arrivalTime: "06:21" },
          { stationId: "phuoc-long", arrivalTime: "06:24" },
          { stationId: "binh-thai", arrivalTime: "06:27" },
          { stationId: "truong-tho", arrivalTime: "06:30" },
          { stationId: "hiep-phu", arrivalTime: "06:33" },
          { stationId: "long-binh", arrivalTime: "06:36" },
          { stationId: "suoi-tien", arrivalTime: "06:40" },
        ],
      },
    ],
    "suoi-tien-to-ben-thanh": [
      {
        departureTime: "05:30",
        stations: [
          { stationId: "suoi-tien", arrivalTime: "05:30" },
          { stationId: "long-binh", arrivalTime: "05:34" },
          { stationId: "hiep-phu", arrivalTime: "05:37" },
          { stationId: "truong-tho", arrivalTime: "05:40" },
          { stationId: "binh-thai", arrivalTime: "05:43" },
          { stationId: "phuoc-long", arrivalTime: "05:46" },
          { stationId: "rach-chiec", arrivalTime: "05:49" },
          { stationId: "an-phu", arrivalTime: "05:52" },
          { stationId: "thu-thiem", arrivalTime: "05:55" },
          { stationId: "tan-cang", arrivalTime: "05:58" },
          { stationId: "van-thanh", arrivalTime: "06:01" },
          { stationId: "ba-son", arrivalTime: "06:04" },
          { stationId: "nha-hat", arrivalTime: "06:07" },
          { stationId: "bt", arrivalTime: "06:10" },
        ],
      },
      {
        departureTime: "05:45",
        stations: [
          { stationId: "suoi-tien", arrivalTime: "05:45" },
          { stationId: "long-binh", arrivalTime: "05:49" },
          { stationId: "hiep-phu", arrivalTime: "05:52" },
          { stationId: "truong-tho", arrivalTime: "05:55" },
          { stationId: "binh-thai", arrivalTime: "05:58" },
          { stationId: "phuoc-long", arrivalTime: "06:01" },
          { stationId: "rach-chiec", arrivalTime: "06:04" },
          { stationId: "an-phu", arrivalTime: "06:07" },
          { stationId: "thu-thiem", arrivalTime: "06:10" },
          { stationId: "tan-cang", arrivalTime: "06:13" },
          { stationId: "van-thanh", arrivalTime: "06:16" },
          { stationId: "ba-son", arrivalTime: "06:19" },
          { stationId: "nha-hat", arrivalTime: "06:22" },
          { stationId: "bt", arrivalTime: "06:25" },
        ],
      },
      {
        departureTime: "06:00",
        stations: [
          { stationId: "suoi-tien", arrivalTime: "06:00" },
          { stationId: "long-binh", arrivalTime: "06:04" },
          { stationId: "hiep-phu", arrivalTime: "06:07" },
          { stationId: "truong-tho", arrivalTime: "06:10" },
          { stationId: "binh-thai", arrivalTime: "06:13" },
          { stationId: "phuoc-long", arrivalTime: "06:16" },
          { stationId: "rach-chiec", arrivalTime: "06:19" },
          { stationId: "an-phu", arrivalTime: "06:22" },
          { stationId: "thu-thiem", arrivalTime: "06:25" },
          { stationId: "tan-cang", arrivalTime: "06:28" },
          { stationId: "van-thanh", arrivalTime: "06:31" },
          { stationId: "ba-son", arrivalTime: "06:34" },
          { stationId: "nha-hat", arrivalTime: "06:37" },
          { stationId: "bt", arrivalTime: "06:40" },
        ],
      },
    ],
  };

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

  const getCurrentSchedules = () => {
    if (!selectedDirection) return [];
    return scheduleData[selectedDirection as keyof typeof scheduleData] || [];
  };

  const handleTimeClick = (schedule: TrainSchedule) => {
    setSelectedSchedule(schedule);
    setIsDialogOpen(true);
  };

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
            schedules={getCurrentSchedules()}
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
  );
};

export default TrainSchedule;
