import React from "react";
import { Clock, Sunrise, Sun, Sunset, Moon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Schedule {
  start_time: {
    start_time: string;
    status?: number;
  };
  // Thêm các thuộc tính khác nếu cần
}

interface TranslationType {
  departureTime: string;
  selectTime: string;
  morning?: string;
  afternoon?: string;
  evening?: string;
  night?: string;
  [key: string]: string | undefined;
}

interface DepartureTimesProps {
  t: TranslationType;
  schedules: Schedule[];
  handleTimeClick: (schedule: string) => void;
}

const DepartureTimes: React.FC<DepartureTimesProps> = ({ t, schedules, handleTimeClick }) => {
  // Nhóm các lịch trình theo khung giờ
  const groupSchedulesByTimeOfDay = () => {
    const morningSchedules = []; // 4:00-11:59
    const afternoonSchedules = []; // 12:00-17:59
    const eveningSchedules = []; // 18:00-23:59
    const nightSchedules = []; // 0:00-3:59

    schedules?.forEach(schedule => {
      const timeString = schedule.start_time?.start_time || "";
      const [hours] = timeString.split(":").map(Number);

      if (hours >= 4 && hours < 12) {
        morningSchedules.push(schedule);
      } else if (hours >= 12 && hours < 18) {
        afternoonSchedules.push(schedule);
      } else if (hours >= 18 && hours < 24) {
        eveningSchedules.push(schedule);
      } else { // 0-3
        nightSchedules.push(schedule);
      }
    });

    return { morningSchedules, afternoonSchedules, eveningSchedules, nightSchedules };
  };

  const { morningSchedules, afternoonSchedules, eveningSchedules, nightSchedules } = groupSchedulesByTimeOfDay();

  // Hàm hiển thị nhóm thời gian
  const renderTimeGroup = (title, icon, schedules) => {
    if (schedules.length === 0) return null;

    return (
      <div className="mb-6 last:mb-0">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="font-medium text-lg">{title}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {schedules.map((schedule, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => handleTimeClick(schedule.start_time.start_time)}
            >
              {schedule.start_time.start_time}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {t.departureTime}
        </CardTitle>
        <CardDescription>{t.selectTime}</CardDescription>
      </CardHeader>
      <CardContent>
        {renderTimeGroup(t.morning || "Buổi sáng", <Sunrise className="h-5 w-5 text-amber-500" />, morningSchedules)}
        {afternoonSchedules.length > 0 && morningSchedules.length > 0 && <Separator className="my-4" />}
        {renderTimeGroup(t.afternoon || "Buổi chiều", <Sun className="h-5 w-5 text-orange-500" />, afternoonSchedules)}
        {eveningSchedules.length > 0 && (morningSchedules.length > 0 || afternoonSchedules.length > 0) && <Separator className="my-4" />}
        {renderTimeGroup(t.evening || "Buổi tối", <Sunset className="h-5 w-5 text-blue-500" />, eveningSchedules)}
        {nightSchedules.length > 0 && (morningSchedules.length > 0 || afternoonSchedules.length > 0 || eveningSchedules.length > 0) && <Separator className="my-4" />}
        {renderTimeGroup(t.night || "Đêm khuya", <Moon className="h-5 w-5 text-indigo-500" />, nightSchedules)}
      </CardContent>
    </Card>
  )
};

export default DepartureTimes; 