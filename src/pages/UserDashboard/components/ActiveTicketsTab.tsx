import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TicketItem {
  id: string;
  type: string;
  validFrom: string;
  validTo: string;
  stations: string;
  qrCode: string;
}

interface ActiveTicketsTabProps {
  activeTickets: TicketItem[];
  onShowQR: (ticket: TicketItem) => void;
}

const ActiveTicketsTab: React.FC<ActiveTicketsTabProps> = ({ activeTickets, onShowQR }) => (
  <Card>
    <CardHeader>
      <CardTitle>Vé điện tử</CardTitle>
      <CardDescription>Quản lý vé điện tử hiện có của bạn</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeTickets.map((ticket) => (
          <Card key={ticket.id} className="overflow-hidden">
            <CardHeader className="bg-blue-50 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{ticket.type}</CardTitle>
                <Badge>{ticket.id}</Badge>
              </div>
              <CardDescription>{ticket.stations}</CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hiệu lực từ:</span>
                  <span>{ticket.validFrom}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hiệu lực đến:</span>
                  <span>{ticket.validTo}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onShowQR(ticket)}
                  >
                    <QrCode className="mr-2 h-4 w-4" /> Hiển thị mã QR
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        <Ticket className="mr-2 h-4 w-4" /> Mua vé mới
      </Button>
    </CardFooter>
  </Card>
);

export default ActiveTicketsTab;
