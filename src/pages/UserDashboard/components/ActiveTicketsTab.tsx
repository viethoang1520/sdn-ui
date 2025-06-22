import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Ticket } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TicketType {
  expiry_date?: string;
  name: string;
  base_price: number;
}

interface TicketItem {
  id: string;
  transactionId: string;
  type: string;
  status: string;
  createdAt: string;
  expiryDate?: string;
  basePrice: number;
  startStation?: string | null;
  endStation?: string | null;
}

interface ActiveTicketsTabProps {
  activeTickets: TicketItem[];
  onShowQR: (ticket: TicketItem) => void;
}

const ActiveTicketsTab: React.FC<ActiveTicketsTabProps> = ({
  activeTickets,
  onShowQR,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Vé điện tử</CardTitle>
      <CardDescription>Quản lý vé điện tử hiện có của bạn</CardDescription>
    </CardHeader>
    <CardContent>
      {activeTickets.length === 0 ? (
        <div className="text-center text-muted-foreground py-10">
          Không có vé nào
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTickets.map((ticket) => (
            <Card key={ticket.id} className="overflow-hidden">
              <CardHeader className="bg-blue-50 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{ticket.type}</CardTitle>
                  <Badge>{ticket.transactionId}</Badge>
                </div>
                {ticket.startStation && ticket.endStation ? (
                  <CardDescription>
                    Tuyến: {ticket.startStation} - {ticket.endStation}
                  </CardDescription>
                ) : (
                  <CardDescription>Vé sử dụng: {ticket.type}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Giá vé:</span>
                    <span>
                      {typeof ticket.basePrice === "number"
                        ? ticket.basePrice.toLocaleString() + " VND"
                        : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trạng thái:</span>
                    <span>{ticket.status || "-"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ngày mua:</span>
                    <span>
                      {ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleString("vi-VN")
                        : "-"}
                    </span>
                  </div>
                  {ticket.expiryDate && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Hạn sử dụng:
                      </span>
                      <span>
                        {ticket.expiryDate
                          ? new Date(ticket.expiryDate).toLocaleDateString(
                              "vi-VN"
                            )
                          : "-"}
                      </span>
                    </div>
                  )}
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
      )}
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        <Ticket className="mr-2 h-4 w-4" /> Mua vé mới
      </Button>
    </CardFooter>
  </Card>
);

export default ActiveTicketsTab;
