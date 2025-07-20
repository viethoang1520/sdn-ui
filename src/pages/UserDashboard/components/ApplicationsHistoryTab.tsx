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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, FileText } from "lucide-react";

interface ApplicationItem {
  _id: string;
  user_type?: string;
  discount?: number;
  cccd: string;
  expiry_date?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
  rejection_reason?: string;
}

interface ApplicationsHistoryTabProps {
  applications: ApplicationItem[];
  onShowDetail: (application: ApplicationItem) => void;
}

const ApplicationsHistoryTab: React.FC<ApplicationsHistoryTabProps> = ({
  applications,
  onShowDetail,
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Đang chờ
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Đã duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Đã từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApplicationType = (application: ApplicationItem) => {
    if (application.discount === 50) {
      return "Sinh viên (Giảm 50%)";
    } else if (application.user_type) {
      const typeMap = {
        child: "Trẻ dưới 6 tuổi (Miễn phí)",
        senior: "Người trên 60 tuổi (Miễn phí)",
        veteran: "Cựu chiến binh (Miễn phí)",
      };
      return typeMap[application.user_type] || `${application.user_type} (Miễn phí)`;
    }
    return "Không xác định";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử đơn xin miễn/giảm vé</CardTitle>
        <CardDescription>
          Xem lại các đơn xin miễn/giảm vé đã nộp và trạng thái xử lý
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          {applications.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4" />
              <p>Không có đơn nào</p>
              <p className="text-sm">Bạn chưa nộp đơn xin miễn/giảm vé nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ngày nộp</TableHead>
                  <TableHead>Loại đơn</TableHead>
                  <TableHead>Số CCCD</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Hạn hiệu lực</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow key={application._id}>
                    <TableCell>
                      {new Date(application.createdAt).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      <div className="truncate">{getApplicationType(application)}</div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {application.cccd}
                    </TableCell>
                    <TableCell>{getStatusBadge(application.status)}</TableCell>
                    <TableCell>
                      {application.expiry_date
                        ? new Date(application.expiry_date).toLocaleDateString("vi-VN")
                        : "Vĩnh viễn"}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onShowDetail(application)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-muted-foreground">
          Tổng cộng: {applications.length} đơn
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApplicationsHistoryTab;
