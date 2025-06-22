import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PurchaseHistoryApiItem {
  _id: string;
  transaction_id?: string;
  ticket_type?: {
    expiry_date?: string;
    name: string;
    base_price: number;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  start_station_name?: string | null;
  end_station_name?: string | null;
}

interface PurchaseHistoryTabProps {
  purchaseHistory: PurchaseHistoryApiItem[];
}

const PurchaseHistoryTab: React.FC<PurchaseHistoryTabProps> = ({
  purchaseHistory,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Lịch sử mua vé</CardTitle>
      <CardDescription>Xem lại các giao dịch mua vé của bạn</CardDescription>
    </CardHeader>
    <CardContent>
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mã giao dịch</TableHead>
              <TableHead>Ngày</TableHead>
              <TableHead>Loại vé</TableHead>
              <TableHead>Tuyến</TableHead>
              <TableHead>Số tiền</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHistory.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="font-medium">
                  {item.transaction_id || item._id}
                </TableCell>
                <TableCell>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("vi-VN")
                    : "-"}
                </TableCell>
                <TableCell>{item.ticket_type?.name || "-"}</TableCell>
                <TableCell>
                  {item.start_station_name && item.end_station_name
                    ? `${item.start_station_name} - ${item.end_station_name}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.ticket_type?.base_price !== undefined
                    ? item.ticket_type.base_price.toLocaleString() + " VND"
                    : "-"}
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </CardContent>
    <CardFooter>
      <Button variant="outline" className="w-full">
        <Download className="mr-2 h-4 w-4" /> Xuất lịch sử giao dịch
      </Button>
    </CardFooter>
  </Card>
);

export default PurchaseHistoryTab;
