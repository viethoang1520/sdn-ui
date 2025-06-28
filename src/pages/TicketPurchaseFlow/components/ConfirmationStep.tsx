import React from "react";
import { QrCode, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface Station {
  id: string;
  name: string;
}

interface ConfirmationStepProps {
  ticketTypes: TicketType[];
  selectedTicketType: string;
  originStation: string;
  destinationStation: string;
  stations: Station[];
  calculateFare: () => number;
  formatCurrency: (amount: number) => string;
  onReset: () => void;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  ticketTypes,
  selectedTicketType,
  originStation,
  destinationStation,
  stations,
  calculateFare,
  formatCurrency,
  onReset,
}) => (
  <div className="space-y-6 text-center">
    <div className="mx-auto rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center">
      <Check className="h-8 w-8 text-green-600" />
    </div>
    <div>
      <h3 className="text-xl font-semibold">Mua Vé Thành Công!</h3>
      <p className="text-muted-foreground mt-1">Vé của bạn đã được thêm vào tài khoản</p>
    </div>
    <div className="rounded-lg border p-6 max-w-md mx-auto">
      <div className="mb-4">
        <div className="bg-black p-2 rounded-lg mx-auto w-48 h-48 flex items-center justify-center mb-4">
          <div className="bg-white p-2 rounded">
            <QrCode className="h-32 w-32" />
          </div>
        </div>
        <Badge className="mx-auto">
          {ticketTypes.find((t) => t.id === selectedTicketType)?.name}
        </Badge>
      </div>
      <div className="space-y-2 text-sm">
        {selectedTicketType === "single-trip" && originStation && destinationStation && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tuyến Đường</span>
            <span className="font-medium">
              {`${stations.find((s) => s.id === originStation)?.name} → ${stations.find((s) => s.id === destinationStation)?.name}`}
            </span>
          </div>
        )}
        {selectedTicketType !== "single-trip" && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Phạm Vi</span>
            <span className="font-medium">Tất cả các ga</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Giá Vé</span>
          <span className="font-medium">{formatCurrency(calculateFare())}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Mã Giao Dịch</span>
          <span className="font-medium">
            METRO-{Math.random().toString(36).substring(2, 10).toUpperCase()}
          </span>
        </div>
      </div>
    </div>
    <div className="pt-4">
      <Button variant="outline" onClick={onReset}>
        Mua Vé Khác
      </Button>
    </div>
  </div>
);

export default ConfirmationStep; 