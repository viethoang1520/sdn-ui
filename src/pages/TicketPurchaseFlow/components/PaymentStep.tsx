import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface PaymentStepProps {
  ticketTypes: TicketType[];
  selectedTicketType: string;
  discountApplied: boolean;
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string;
  onSelect: (methodId: string) => void;
  isProcessing: boolean;
  calculateFare: () => number;
  formatCurrency: (amount: number) => string;
}

const PaymentStep: React.FC<PaymentStepProps> = ({
  ticketTypes,
  selectedTicketType,
  discountApplied,
  paymentMethods,
  selectedPaymentMethod,
  onSelect,
  isProcessing,
  calculateFare,
  formatCurrency,
}) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-medium mb-4">Chọn Phương Thức Thanh Toán</h3>
      <RadioGroup
        value={selectedPaymentMethod}
        onValueChange={onSelect}
        className="space-y-3"
      >
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center space-x-2">
            <RadioGroupItem value={method.id} id={method.id} />
            <Label htmlFor={method.id} className="flex items-center gap-2 cursor-pointer">
              {method.icon}
              <span>{method.name}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
    {selectedPaymentMethod && (
      <div className="rounded-lg border p-4">
        <h3 className="font-medium mb-2">Tóm Tắt Thanh Toán</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Loại Vé</span>
            <span>{ticketTypes.find((t) => t.id === selectedTicketType)?.name}</span>
          </div>
          {discountApplied && selectedTicketType === "monthly" && (
            <div className="flex justify-between text-green-600">
              <span>Giảm Giá Sinh Viên</span>
              <span>-50%</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Tổng Cộng</span>
            <span>{formatCurrency(calculateFare())}</span>
          </div>
        </div>
      </div>
    )}
    {isProcessing && (
      <div className="space-y-2">
        <Progress value={45} className="w-full" />
        <p className="text-center text-sm text-muted-foreground">Đang xử lý thanh toán...</p>
      </div>
    )}
  </div>
);

export default PaymentStep; 