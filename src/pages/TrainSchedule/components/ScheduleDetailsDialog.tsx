import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Train } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface ScheduleDetailsDialogProps {
  t: any;
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  selectedSchedule: any;
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
      <DialogTitle asChild>
        <VisuallyHidden>
          {t.scheduleDetails}
        </VisuallyHidden>
      </DialogTitle>
      {selectedSchedule && (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Train className="h-5 w-5" />
              {t.scheduleDetails} - {selectedSchedule[0].arrivalTime}
            </DialogTitle>
            <DialogDescription>
              {selectedDirection === "Bến Thành - Suối Tiên"
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
                {selectedSchedule.map((station, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {station.station}
                    </TableCell>
                    <TableCell className="text-primary font-semibold">
                      {station.arrivalTime}
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
)

export default ScheduleDetailsDialog