import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, FileText, Home } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface SuccessPaymentProps {
  orderCode?: string;
  amount?: string;
  paymentMethod?: string;
  paymentTime?: string;
  products?: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
}

export default function SuccessPayment({
  paymentMethod = "VNPAY",
}: SuccessPaymentProps) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const code = searchParams.get('order_code')

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-md mx-auto bg-white shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            ✅ Thanh toán thành công
          </h1>
          <p className="text-gray-600">
            Giao dịch của bạn đã được xử lý thành công
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mã đơn hàng:</span>
              <span className="font-semibold text-blue-600">#{code}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              size="lg"
            >
              <Home className="w-4 h-4 mr-2" />
              Quay về trang chủ
            </Button>

            <Button
              onClick={() => navigate("/orders")}
              variant="outline"
              className="w-full"
              size="lg"
            >
              <FileText className="w-4 h-4 mr-2" />
              Xem đơn hàng
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
