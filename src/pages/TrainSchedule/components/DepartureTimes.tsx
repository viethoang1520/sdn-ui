import React from "react";
import { Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrainSchedule {
  departureTime: string;
  stations: { stationId: string; arrivalTime: string }[];
}

interface DepartureTimesProps {
  t: any;
  schedules: TrainSchedule[];
  handleTimeClick: (schedule: TrainSchedule) => void;
}

const DepartureTimes: React.FC<DepartureTimesProps> = ({ t, schedules, handleTimeClick }) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Clock className="h-5 w-5" />
        {t.departureTime}
      </CardTitle>
      <CardDescription>{t.selectTime}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {schedules.map((schedule, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-16 text-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={() => handleTimeClick(schedule)}
          >
            {schedule.departureTime}
          </Button>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default DepartureTimes; 