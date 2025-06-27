import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  CreditCard,
  QrCode,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import TicketTypeSelection from "./components/TicketTypeSelection";
import StationSelection from "./components/StationSelection";
import PaymentStep from "./components/PaymentStep";
import ConfirmationStep from "./components/ConfirmationStep";

const ticketTypes = [
  {
    id: "single-trip",
    name: "Vé một lượt",
    price: 15000,
    description: "Sử dụng cho một lượt đi từ ga xuất phát đến ga đích",
  },
  {
    id: "daily",
    name: "Vé ngày",
    price: 40000,
    description: "Không giới hạn số lượt đi trong ngày",
  },
  {
    id: "3-day",
    name: "Vé 3 ngày",
    price: 90000,
    description: "Không giới hạn số lượt đi trong 3 ngày liên tiếp",
  },
  {
    id: "monthly",
    name: "Vé tháng",
    price: 300000,
    description: "Không giới hạn số lượt đi trong 30 ngày",
  },
];

const stations = [
  { id: "ben-thanh", name: "Bến Thành" },
  { id: "ba-son", name: "Ba Son" },
  { id: "van-thanh", name: "Văn Thánh" },
  { id: "tan-cang", name: "Tân Cảng" },
  { id: "thao-dien", name: "Thảo Điền" },
  { id: "an-phu", name: "An Phú" },
  { id: "rach-chiec", name: "Rạch Chiếc" },
  { id: "phuoc-long", name: "Phước Long" },
  { id: "binh-thai", name: "Bình Thái" },
  { id: "thu-duc", name: "Thủ Đức" },
  { id: "high-tech-park", name: "Khu Công Nghệ Cao" },
  { id: "suoi-tien", name: "Suối Tiên" },
  { id: "suoi-tien-terminal", name: "Bến xe Suối Tiên" },
  { id: "depot", name: "Depot" },
];

const paymentMethods = [
  { id: "napas", name: "Napas", icon: <CreditCard className="h-5 w-5" /> },
  { id: "visa", name: "Visa", icon: <CreditCard className="h-5 w-5" /> },
  { id: "momo", name: "MoMo", icon: <QrCode className="h-5 w-5" /> },
];

const TicketPurchaseFlow = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTicketType, setSelectedTicketType] = useState("");
  const [originStation, setOriginStation] = useState("");
  const [destinationStation, setDestinationStation] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseComplete, setPurchaseComplete] = useState(false);

  const steps = [
    "Chọn Loại Vé",
    ...(selectedTicketType === "single-trip" ? ["Chọn Ga"] : []),
    "Thanh Toán",
    "Xác Nhận",
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      if (selectedTicketType !== "single-trip" && currentStep === 2) {
        setCurrentStep(currentStep - 2);
      } else {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleTicketTypeSelect = (ticketId: string) => {
    setSelectedTicketType(ticketId);
    if (ticketId !== "single-trip") {
      setOriginStation("");
      setDestinationStation("");
    }
  };

  const handleStationSelect = (type: "origin" | "destination", stationId: string) => {
    if (type === "origin") {
      setOriginStation(stationId);
    } else {
      setDestinationStation(stationId);
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePaymentSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPurchaseComplete(true);
    }, 2000);
  };

  const calculateFare = () => {
    const selectedTicket = ticketTypes.find((ticket) => ticket.id === selectedTicketType);
    if (!selectedTicket) return 0;
    return selectedTicket.price;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(amount)
      .replace("₫", "VND");
  };

  const renderStepContent = () => {
    const currentStepName = steps[currentStep];
    switch (currentStepName) {
      case "Chọn Loại Vé":
        return (
          <TicketTypeSelection
            ticketTypes={ticketTypes}
            selectedTicketType={selectedTicketType}
            onSelect={handleTicketTypeSelect}
            formatCurrency={formatCurrency}
          />
        );
      case "Chọn Ga":
        return (
          <StationSelection
            stations={stations}
            originStation={originStation}
            destinationStation={destinationStation}
            onSelect={handleStationSelect}
          />
        );
      case "Thanh Toán":
        return (
          <PaymentStep
            ticketTypes={ticketTypes}
            selectedTicketType={selectedTicketType}
            discountApplied={discountApplied}
            paymentMethods={paymentMethods}
            selectedPaymentMethod={selectedPaymentMethod}
            onSelect={handlePaymentMethodSelect}
            isProcessing={isProcessing}
            calculateFare={calculateFare}
            formatCurrency={formatCurrency}
          />
        );
      case "Xác Nhận":
        return (
          <ConfirmationStep
            ticketTypes={ticketTypes}
            selectedTicketType={selectedTicketType}
            originStation={originStation}
            destinationStation={destinationStation}
            stations={stations}
            calculateFare={calculateFare}
            formatCurrency={formatCurrency}
            onReset={() => {
              setCurrentStep(0);
              setSelectedTicketType("");
              setOriginStation("");
              setDestinationStation("");
              setDiscountApplied(false);
              setSelectedPaymentMethod("");
              setPurchaseComplete(false);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-sm border">
      <div className="p-4 border-b">
        <div className="mb-2">
          <Progress value={(currentStep / (steps.length - 1)) * 100} className="h-2" />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          {steps.map((step, index) => (
            <div key={index} className={`${index <= currentStep ? "text-primary font-medium" : ""}`}>{step}</div>
          ))}
        </div>
      </div>
      <div className="p-6">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderStepContent()}
        </motion.div>
      </div>
      <div className="p-4 border-t flex justify-between">
        <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay Lại
        </Button>
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={handleNext}
            disabled={
              (steps[currentStep] === "Chọn Loại Vé" && !selectedTicketType) ||
              (steps[currentStep] === "Chọn Ga" && (!originStation || !destinationStation)) ||
              (steps[currentStep] === "Thanh Toán" && (!selectedPaymentMethod || isProcessing))
            }
          >
            Tiếp Tục
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : steps[currentStep] === "Thanh Toán" ? (
          <Button onClick={handlePaymentSubmit} disabled={!selectedPaymentMethod || isProcessing}>
            Hoàn Tất Mua Vé
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export default TicketPurchaseFlow;
