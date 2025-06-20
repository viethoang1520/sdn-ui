import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface PurchaseHistoryItem {
  id: string;
  date: string;
  ticketType: string;
  stations: string;
  amount: string;
  paymentMethod: string;
}

interface PurchaseHistoryTabProps {
  purchaseHistory: PurchaseHistoryItem[];
}

const PurchaseHistoryTab: React.FC<PurchaseHistoryTabProps> = ({ purchaseHistory }) => (
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
              <TableHead>Thanh toán</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.ticketType}</TableCell>
                <TableCell>{item.stations}</TableCell>
                <TableCell>{item.amount}</TableCell>
                <TableCell>{item.paymentMethod}</TableCell>
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
