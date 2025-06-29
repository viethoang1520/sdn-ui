import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Trash2 } from "lucide-react";
import React from "react";

interface FareRule {
  id: string;
  ticketType: string;
  fromStation: string;
  toStation: string;
  price: number;
  discountPrice: number;
  active: boolean;
}

interface FareManagementTabProps {
  fareRules: FareRule[];
  stations: string[];
  language: "vi" | "en";
}

const FareManagementTab: React.FC<FareManagementTabProps> = ({ fareRules, stations, language }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">
        {language === "vi" ? "Quản lý giá vé" : "Fare Management"}
      </h3>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {language === "vi" ? "Thêm quy tắc giá vé" : "Add Fare Rule"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{language === "vi" ? "Thêm quy tắc giá vé mới" : "Add New Fare Rule"}</DialogTitle>
            <DialogDescription>{language === "vi" ? "Điền thông tin để tạo quy tắc giá vé mới." : "Fill in the information to create a new fare rule."}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">{language === "vi" ? "Loại vé" : "Ticket Type"}</label>
              <Select defaultValue="single-trip">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-trip">{language === "vi" ? "Vé một lượt" : "Single Trip"}</SelectItem>
                  <SelectItem value="daily">{language === "vi" ? "Vé ngày" : "Daily Pass"}</SelectItem>
                  <SelectItem value="three-day">{language === "vi" ? "Vé 3 ngày" : "3-Day Pass"}</SelectItem>
                  <SelectItem value="monthly">{language === "vi" ? "Vé tháng" : "Monthly Pass"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">{language === "vi" ? "Ga đi" : "From Station"}</label>
              <Select defaultValue="ben-thanh">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station, index) => (
                    <SelectItem key={index} value={station.toLowerCase().replace(" ", "-")}>{station}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">{language === "vi" ? "Ga đến" : "To Station"}</label>
              <Select defaultValue="suoi-tien">
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {stations.map((station, index) => (
                    <SelectItem key={index} value={station.toLowerCase().replace(" ", "-")}>{station}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">{language === "vi" ? "Giá tiêu chuẩn" : "Standard Price"}</label>
              <Input type="number" defaultValue="20000" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right">{language === "vi" ? "Giá ưu đãi" : "Discount Price"}</label>
              <Input type="number" defaultValue="10000" className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{language === "vi" ? "Lưu" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === "vi" ? "Loại vé" : "Ticket Type"}</TableHead>
            <TableHead>{language === "vi" ? "Ga đi" : "From Station"}</TableHead>
            <TableHead>{language === "vi" ? "Ga đến" : "To Station"}</TableHead>
            <TableHead className="text-right">{language === "vi" ? "Giá tiêu chuẩn" : "Standard Price"}</TableHead>
            <TableHead className="text-right">{language === "vi" ? "Giá ưu đãi" : "Discount Price"}</TableHead>
            <TableHead>{language === "vi" ? "Trạng thái" : "Status"}</TableHead>
            <TableHead className="text-right">{language === "vi" ? "Thao tác" : "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fareRules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>{rule.ticketType}</TableCell>
              <TableCell>{rule.fromStation}</TableCell>
              <TableCell>{rule.toStation}</TableCell>
              <TableCell className="text-right">{rule.price.toLocaleString()} VND</TableCell>
              <TableCell className="text-right">{rule.discountPrice.toLocaleString()} VND</TableCell>
              <TableCell>
                <Badge variant={rule.active ? "default" : "outline"}>
                  {rule.active ? (language === "vi" ? "Đang hoạt động" : "Active") : (language === "vi" ? "Không hoạt động" : "Inactive")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{language === "vi" ? "Xác nhận xóa" : "Confirm Deletion"}</AlertDialogTitle>
                        <AlertDialogDescription>{language === "vi" ? "Bạn có chắc chắn muốn xóa quy tắc giá vé này không? Hành động này không thể hoàn tác." : "Are you sure you want to delete this fare rule? This action cannot be undone."}</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{language === "vi" ? "Hủy" : "Cancel"}</AlertDialogCancel>
                        <AlertDialogAction className="bg-red-500 hover:bg-red-600">{language === "vi" ? "Xóa" : "Delete"}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default FareManagementTab; 