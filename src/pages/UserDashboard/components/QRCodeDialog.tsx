import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface TicketItem {
  id: string;
  type: string;
  validFrom: string;
  validTo: string;
  stations: string;
  qrCode: string;
}

interface QRCodeDialogProps {
  open: boolean;
  ticket: TicketItem | null;
  onClose: () => void;
}

const QRCodeDialog: React.FC<QRCodeDialogProps> = ({ open, ticket, onClose }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Mã QR vé điện tử</DialogTitle>
        <DialogDescription>Quét mã QR này tại cổng vào để sử dụng vé của bạn</DialogDescription>
      </DialogHeader>
      {ticket && (
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <img src={ticket.qrCode} alt="QR Code" className="w-64 h-64" />
          </div>
          <div className="text-center space-y-1">
            <p className="font-medium">{ticket.type} - {ticket.id}</p>
            <p className="text-sm text-muted-foreground">{ticket.stations}</p>
            <p className="text-sm text-muted-foreground">
              Hiệu lực: {ticket.validFrom} - {ticket.validTo}
            </p>
          </div>
          <div className="flex items-center text-amber-600 bg-amber-50 p-2 rounded-md text-sm">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span>Vui lòng không chụp màn hình mã QR này</span>
          </div>
        </div>
      )}
      <DialogFooter>
        <Button onClick={onClose}>Đóng</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default QRCodeDialog;
