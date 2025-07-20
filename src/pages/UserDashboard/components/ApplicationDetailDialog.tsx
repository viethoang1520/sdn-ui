import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  CreditCard,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

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

interface ApplicationDetailDialogProps {
  open: boolean;
  application: ApplicationItem | null;
  onClose: () => void;
}

const ApplicationDetailDialog: React.FC<ApplicationDetailDialogProps> = ({
  open,
  application,
  onClose,
}) => {
  if (!application) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "APPROVED":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "REJECTED":
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Đang chờ xử lý
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Đã được duyệt
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Đã bị từ chối
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getApplicationType = () => {
    if (application.discount === 50) {
      return {
        title: "Đơn xin giảm giá vé sinh viên",
        description: "Giảm 50% giá vé cho sinh viên",
        type: "Sinh viên"
      };
    } else if (application.user_type) {
      const typeMap = {
        child: {
          title: "Đơn xin miễn phí vé trẻ em",
          description: "Miễn phí vé cho trẻ dưới 6 tuổi",
          type: "Trẻ dưới 6 tuổi"
        },
        senior: {
          title: "Đơn xin miễn phí vé người cao tuổi",
          description: "Miễn phí vé cho người trên 60 tuổi",
          type: "Người trên 60 tuổi"
        },
        veteran: {
          title: "Đơn xin miễn phí vé cựu chiến binh",
          description: "Miễn phí vé cho cựu chiến binh",
          type: "Cựu chiến binh"
        },
      };
      return typeMap[application.user_type] || {
        title: "Đơn xin miễn phí vé",
        description: "Miễn phí vé",
        type: application.user_type
      };
    }
    return {
      title: "Đơn xin ưu đãi",
      description: "Không xác định",
      type: "Không xác định"
    };
  };

  const typeInfo = getApplicationType();

  const getStatusMessage = () => {
    switch (application.status) {
      case "PENDING":
        return {
          message: "Đơn của bạn đang được xem xét. Chúng tôi sẽ phản hồi trong vòng 3-5 ngày làm việc.",
          type: "info" as const
        };
      case "APPROVED":
        return {
          message: "Đơn của bạn đã được duyệt. Bạn có thể sử dụng ưu đãi khi mua vé.",
          type: "success" as const
        };
      case "REJECTED":
        return {
          message: application.rejection_reason || "Đơn của bạn đã bị từ chối.",
          type: "error" as const
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getStatusIcon(application.status)}
            <div>
              <DialogTitle>{typeInfo.title}</DialogTitle>
              <DialogDescription>{typeInfo.description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Alert */}
          {statusMessage && (
            <Alert className={
              statusMessage.type === "success"
                ? "border-green-200 bg-green-50"
                : statusMessage.type === "error"
                  ? "border-red-200 bg-red-50"
                  : "border-blue-200 bg-blue-50"
            }>
              <AlertDescription className={
                statusMessage.type === "success"
                  ? "text-green-800"
                  : statusMessage.type === "error"
                    ? "text-red-800"
                    : "text-blue-800"
              }>
                {statusMessage.message}
              </AlertDescription>
            </Alert>
          )}

          {/* Application Details */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4" />
                  Loại đối tượng
                </div>
                <p className="text-sm">{typeInfo.type}</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Số CCCD
                </div>
                <p className="text-sm font-mono">{application.cccd}</p>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Ngày nộp đơn
                </div>
                <p className="text-sm">
                  {new Date(application.createdAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Hạn hiệu lực
                </div>
                <p className="text-sm">
                  {application.expiry_date
                    ? new Date(application.expiry_date).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })
                    : "Vĩnh viễn"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Trạng thái</div>
              <div className="flex items-center gap-2">
                {getStatusBadge(application.status)}
                <span className="text-sm text-muted-foreground">
                  (Cập nhật: {new Date(application.updatedAt).toLocaleDateString("vi-VN")})
                </span>
              </div>
            </div>

            {/* Discount Information */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-medium text-blue-900 mb-1">Mức ưu đãi</div>
              <div className="text-sm text-blue-800">
                {application.discount === 50
                  ? "Giảm 50% giá vé"
                  : "Miễn phí 100%"}
              </div>
            </div>

            {/* Application ID */}
            <div className="text-xs text-muted-foreground">
              Mã đơn: {application._id}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailDialog;
