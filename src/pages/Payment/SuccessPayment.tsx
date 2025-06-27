import { CheckCircle, Home, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

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
  orderCode = "#123456",
  amount = "200.000₫",
  paymentMethod = "VNPAY",
  paymentTime = new Date().toLocaleString("vi-VN"),
  products = [
    { name: "Vé tàu điện ngầm - Lượt đi", quantity: 1, price: "200.000₫" },
  ],
}: SuccessPaymentProps) {
  const navigate = useNavigate();

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
              <span className="font-semibold text-blue-600">{orderCode}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Số tiền:</span>
              <span className="font-bold text-lg text-green-600">{amount}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phương thức:</span>
              <span className="font-semibold">{paymentMethod}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600">Thời gian:</span>
              <span className="font-semibold">{paymentTime}</span>
            </div>
          </div>

          {products && products.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Danh sách sản phẩm:</h3>
              <div className="space-y-2">
                {products.map((product, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {product.quantity}
                      </p>
                    </div>
                    <span className="font-semibold">{product.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

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
