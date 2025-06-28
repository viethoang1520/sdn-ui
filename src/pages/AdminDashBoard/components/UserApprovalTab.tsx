import { approveApplication, rejectApplication } from "@/apis/admin";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, Filter, XCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface UserApproval {
  //applicationId:
  _id: string
  user_id: string
  full_name: string
  cccd: string
  user_type: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  dateSubmitted: string,
  createdAt: string
}

interface UserApprovalTabProps {
  userApprovals: UserApproval[]
  language: "vi" | "en"
  fetchUserApprove: () => void
}

const UserApprovalTab: React.FC<UserApprovalTabProps> = ({ userApprovals, language, fetchUserApprove }) => {

  const handleApprove = async (id: string) => {
    const { data } = await approveApplication(id)
    fetchUserApprove()
    if (data.errorCode === 0) {
      toast.success(data.message)
    } else {
      toast.success(data.message)
    }
  }

  const handleReject = async (id: string) => {
    const { data } = await rejectApplication(id)
    fetchUserApprove()
    if (data.errorCode === 0) {
      toast.success(data.message)
    } else {
      toast.success(data.message)
    }
  }

  return (
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
            {userApprovals?.map((user, index) => (
              <TableRow key={index}>
                <TableCell>{user?.full_name}</TableCell>
                <TableCell>{user?.cccd}</TableCell>
                <TableCell>{user?.user_type}</TableCell>
                <TableCell>{user?.createdAt}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      user?.status === "PENDING"
                        ? "outline"
                        : user?.status === "APPROVED"
                          ? "default"
                          : "destructive"
                    }
                  >
                    {user?.status === "PENDING" && (language === "vi" ? "Đang chờ" : "Pending")}
                    {user?.status === "APPROVED" && (language === "vi" ? "Đã duyệt" : "Approved")}
                    {user?.status === "REJECTED" && (language === "vi" ? "Đã từ chối" : "Rejected")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    {user?.status === "PENDING" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-green-500" onClick={() => handleApprove(user._id)}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleReject(user._id)}>
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
                            <span className="col-span-3">{user?.full_name}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right font-medium">{language === "vi" ? "CCCD" : "ID Card"}:</label>
                            <span className="col-span-3">{user?.cccd}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right font-medium">{language === "vi" ? "Loại" : "Type"}:</label>
                            <span className="col-span-3">{user.user_type}</span>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right font-medium">{language === "vi" ? "Ngày nộp" : "Date Submitted"}:</label>
                            {/* <span className="col-span-3">{user.dateSubmitted}</span> */}
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label className="text-right font-medium">{language === "vi" ? "Trạng thái" : "Status"}:</label>
                            <span className="col-span-3">
                              <Badge
                                variant={
                                  user.status === "PENDING"
                                    ? "outline"
                                    : user.status === "APPROVED"
                                      ? "default"
                                      : "destructive"
                                }
                              >
                                {user.status === "PENDING" && (language === "vi" ? "Đang chờ" : "Pending")}
                                {user.status === "APPROVED" && (language === "vi" ? "Đã duyệt" : "Approved")}
                                {user.status === "REJECTED" && (language === "vi" ? "Đã từ chối" : "Rejected")}
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
  )
}

export default UserApprovalTab;