import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Train } from "lucide-react";

interface ScheduleEntry {
  stationId: string;
  arrivalTime: string;
}

interface TrainSchedule {
  departureTime: string;
  stations: ScheduleEntry[];
}

interface ScheduleDetailsDialogProps {
  t: any;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedSchedule: TrainSchedule | null;
  selectedDirection: string;
  getStationName: (stationId: string) => string;
}

const ScheduleDetailsDialog: React.FC<ScheduleDetailsDialogProps> = ({
  t,
  isDialogOpen,
  setIsDialogOpen,
  selectedSchedule,
  selectedDirection,
  getStationName,
}) => (
  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      {selectedSchedule && (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Train className="h-5 w-5" />
              {t.scheduleDetails} - {selectedSchedule.departureTime}
            </DialogTitle>
            <DialogDescription>
              {selectedDirection === "ben-thanh-to-suoi-tien"
                ? t.benThanhToSuoiTien
                : t.suoiTienToBenThanh}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.station}</TableHead>
                  <TableHead>{t.arrivalTime}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedSchedule.stations.map((entry, stationIndex) => (
                  <TableRow key={stationIndex}>
                    <TableCell className="font-medium">
                      {getStationName(entry.stationId)}
                    </TableCell>
                    <TableCell className="text-primary font-semibold">
                      {entry.arrivalTime}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </DialogContent>
  </Dialog>
);

export default ScheduleDetailsDialog; 