import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Filter, CheckCircle, XCircle } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface UserApproval {
  id: string;
  name: string;
  cccd: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  dateSubmitted: string;
}

interface UserApprovalTabProps {
  userApprovals: UserApproval[];
  language: "vi" | "en";
}

const UserApprovalTab: React.FC<UserApprovalTabProps> = ({ userApprovals, language }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">
        {language === "vi" ? "Phê duyệt người dùng" : "User Approval"}
      </h3>
      <div className="flex space-x-2">
        <Select defaultValue="all">
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{language === "vi" ? "Tất cả" : "All"}</SelectItem>
            <SelectItem value="pending">{language === "vi" ? "Đang chờ" : "Pending"}</SelectItem>
            <SelectItem value="approved">{language === "vi" ? "Đã duyệt" : "Approved"}</SelectItem>
            <SelectItem value="rejected">{language === "vi" ? "Đã từ chối" : "Rejected"}</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{language === "vi" ? "Tên" : "Name"}</TableHead>
            <TableHead>{language === "vi" ? "CCCD" : "ID Card"}</TableHead>
            <TableHead>{language === "vi" ? "Loại" : "Type"}</TableHead>
            <TableHead>{language === "vi" ? "Ngày nộp" : "Date Submitted"}</TableHead>
            <TableHead>{language === "vi" ? "Trạng thái" : "Status"}</TableHead>
            <TableHead className="text-right">{language === "vi" ? "Thao tác" : "Actions"}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userApprovals.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.cccd}</TableCell>
              <TableCell>{user.type}</TableCell>
              <TableCell>{user.dateSubmitted}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    user.status === "pending"
                      ? "outline"
                      : user.status === "approved"
                      ? "default"
                      : "destructive"
                  }
                >
                  {user.status === "pending" && (language === "vi" ? "Đang chờ" : "Pending")}
                  {user.status === "approved" && (language === "vi" ? "Đã duyệt" : "Approved")}
                  {user.status === "rejected" && (language === "vi" ? "Đã từ chối" : "Rejected")}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {user.status === "pending" && (
                    <>
                      <Button variant="ghost" size="icon" className="text-green-500">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-red-500">
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="19" cy="12" r="1" />
                          <circle cx="5" cy="12" r="1" />
                        </svg>
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{language === "vi" ? "Chi tiết người dùng" : "User Details"}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right font-medium">{language === "vi" ? "Tên" : "Name"}:</label>
                          <span className="col-span-3">{user.name}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right font-medium">{language === "vi" ? "CCCD" : "ID Card"}:</label>
                          <span className="col-span-3">{user.cccd}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right font-medium">{language === "vi" ? "Loại" : "Type"}:</label>
                          <span className="col-span-3">{user.type}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right font-medium">{language === "vi" ? "Ngày nộp" : "Date Submitted"}:</label>
                          <span className="col-span-3">{user.dateSubmitted}</span>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right font-medium">{language === "vi" ? "Trạng thái" : "Status"}:</label>
                          <span className="col-span-3">
                            <Badge
                              variant={
                                user.status === "pending"
                                  ? "outline"
                                  : user.status === "approved"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {user.status === "pending" && (language === "vi" ? "Đang chờ" : "Pending")}
                              {user.status === "approved" && (language === "vi" ? "Đã duyệt" : "Approved")}
                              {user.status === "rejected" && (language === "vi" ? "Đã từ chối" : "Rejected")}
                            </Badge>
                          </span>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label className="text-right font-medium">{language === "vi" ? "Hình ảnh CCCD" : "ID Card Image"}:</label>
                          <div className="col-span-3 h-40 bg-muted rounded-md flex items-center justify-center">
                            <span className="text-muted-foreground">{language === "vi" ? "Hình ảnh CCCD" : "ID Card Image"}</span>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
);

export default UserApprovalTab; 