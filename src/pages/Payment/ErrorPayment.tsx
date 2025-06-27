import { XCircle, Home, RefreshCw, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

interface ErrorPaymentProps {
  orderCode?: string;
  errorType?: "failed" | "cancelled";
  reason?: string;
  onRetryPayment?: () => void;
}

export default function ErrorPayment({
  orderCode,
  errorType = "failed",
  reason,
  onRetryPayment,
}: ErrorPaymentProps) {
  const navigate = useNavigate();

  const getErrorMessage = () => {
    if (errorType === "cancelled") {
      return {
        title: "Bạn đã hủy giao dịch",
        description: "Giao dịch thanh toán đã bị hủy bởi người dùng",
      };
    }
    return {
      title: "❌ Thanh toán thất bại",
      description: "Đã xảy ra lỗi trong quá trình xử lý thanh toán",
    };
  };

  const errorMessage = getErrorMessage();

  const getReasonText = () => {
    if (reason) return reason;
    if (errorType === "cancelled") return "Người dùng hủy giao dịch";
    return "Lỗi hệ thống, vui lòng thử lại";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <XCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            {errorMessage.title}
          </h1>
          <p className="text-gray-600">{errorMessage.description}</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg space-y-3 border border-red-200">
            {orderCode && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Mã đơn hàng:</span>
                <span className="font-semibold text-red-600">{orderCode}</span>
              </div>
            )}

            <div className="flex justify-between items-start">
              <span className="text-gray-600">Lý do:</span>
              <span className="font-medium text-red-600 text-right flex-1 ml-2">
                {getReasonText()}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-semibold">
                {new Date().toLocaleString("vi-VN")}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              💡 <strong>Gợi ý:</strong> Vui lòng kiểm tra lại thông tin thanh
              toán hoặc thử phương thức thanh toán khác.
            </p>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            {onRetryPayment && (
              <Button
                onClick={onRetryPayment}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại thanh toán
              </Button>
            )}

            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Trang chủ
            </Button>

            <Button
              onClick={() => window.open("tel:1900-xxxx", "_self")}
              variant="outline"
              className="w-full border-green-300 text-green-700 hover:bg-green-50"
              size="lg"
            >
              <Phone className="w-4 h-4 mr-2" />
              Liên hệ hỗ trợ
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
