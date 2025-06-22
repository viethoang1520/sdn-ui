import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Ticket,
  CreditCard,
  QrCode,
  CheckCircle,
  ArrowRight,
  Train,
  Users,
  Calendar,
  Zap,
  Shield,
  Gift,
  Globe,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { purchaseTicket } from "@/lib/api";

interface TicketType {
  id: string;
  name: string;
  nameEn: string;
  price: number;
  originalPrice?: number;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  icon: React.ReactNode;
  popular?: boolean;
  discount?: number;
}

interface Station {
  _id: string;
  name: string;
  nameEn?: string;
  zone?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  description: string;
  descriptionEn: string;
}

const ticketTypes: TicketType[] = [
  {
    id: "single-trip",
    name: "Vé một lượt",
    nameEn: "Single Trip",
    price: 15000,
    description: "Vé đi một chiều từ ga xuất phát đến ga đích",
    descriptionEn: "One-way ticket from origin to destination station",
    features: ["Sử dụng một lần", "Không giới hạn thời gian trong ngày", "Có thể chuyển tuyến"],
    featuresEn: ["Single use", "No time limit within the day", "Transfer allowed"],
    icon: <Ticket className="h-6 w-6" />,
  },
  {
    id: "daily",
    name: "Vé ngày",
    nameEn: "Daily Pass",
    price: 40000,
    originalPrice: 50000,
    discount: 20,
    description: "Không giới hạn số lượt đi trong ngày",
    descriptionEn: "Unlimited rides for one day",
    features: ["Không giới hạn lượt đi", "Có hiệu lực 24 giờ", "Tiết kiệm cho chuyến đi nhiều"],
    featuresEn: ["Unlimited rides", "Valid for 24 hours", "Cost-effective for multiple trips"],
    icon: <Calendar className="h-6 w-6" />,
    popular: true,
  },
  {
    id: "3-day",
    name: "Vé 3 ngày",
    nameEn: "3-Day Pass",
    price: 90000,
    originalPrice: 120000,
    discount: 25,
    description: "Không giới hạn số lượt đi trong 3 ngày liên tiếp",
    descriptionEn: "Unlimited rides for three consecutive days",
    features: ["Không giới hạn lượt đi", "Có hiệu lực 72 giờ", "Lý tưởng cho du lịch"],
    featuresEn: ["Unlimited rides", "Valid for 72 hours", "Perfect for tourism"],
    icon: <Users className="h-6 w-6" />,
  },
  {
    id: "monthly",
    name: "Vé tháng",
    nameEn: "Monthly Pass",
    price: 300000,
    originalPrice: 450000,
    discount: 33,
    description: "Không giới hạn số lượt đi trong 30 ngày",
    descriptionEn: "Unlimited rides for 30 days",
    features: ["Không giới hạn lượt đi", "Có hiệu lực 30 ngày", "Tiết kiệm nhất cho người đi thường xuyên"],
    featuresEn: ["Unlimited rides", "Valid for 30 days", "Best value for regular commuters"],
    icon: <Zap className="h-6 w-6" />,
  },
];

const Tickets: React.FC = () => {
  const [language, setLanguage] = useState<"vi" | "en">("vi");
  const [selectedTicketType, setSelectedTicketType] = useState<string>("");
  const [originStation, setOriginStation] = useState<string>("");
  const [destinationStation, setDestinationStation] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showPaymentMethods, setShowPaymentMethods] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("adult");
  const [stations, setStations] = useState<Station[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/station/stations")
      .then(res => res.json())
      .then(data => setStations(data));
  }, []);

  const paymentMethods: PaymentMethod[] = [
    {
      id: "cash",
      name: "Tiền mặt",
      nameEn: "Cash",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Thanh toán bằng tiền mặt",
      descriptionEn: "Pay with cash",
    },
    {
      id: "non-cash",
      name: "Không tiền mặt",
      nameEn: "Non-cash",
      icon: <QrCode className="h-5 w-5" />,
      description: "Thanh toán không dùng tiền mặt",
      descriptionEn: "Pay without cash",
    },
  ];

  const t = {
    vi: {
      title: "Mua Vé Metro",
      subtitle: "Chọn loại vé phù hợp với nhu cầu của bạn",
      selectTicketType: "Chọn loại vé",
      selectStations: "Chọn ga",
      quantity: "Số lượng",
      total: "Tổng cộng",
      buyNow: "Mua ngay",
      popular: "Phổ biến",
      discount: "Giảm giá",
      features: "Tính năng",
      paymentMethods: "Phương thức thanh toán",
      securePayment: "Thanh toán an toàn",
      instantDelivery: "Giao vé tức thì",
      support: "Hỗ trợ 24/7",
      originStation: "Ga xuất phát",
      destinationStation: "Ga đích",
      selectOrigin: "Chọn ga xuất phát",
      selectDestination: "Chọn ga đích",
      calculateFare: "Tính giá vé",
      fareInfo: "Thông tin giá vé",
      zoneInfo: "Thông tin khu vực",
      selectPayment: "Chọn phương thức thanh toán",
      proceedToPayment: "Tiến hành thanh toán",
      benefits: "Lợi ích",
      fareCalculation: "Tính giá vé",
      zoneBased: "Giá vé theo khu vực",
      zone1: "Khu vực 1: 15.000đ",
      zone2: "Khu vực 2: 20.000đ",
      zone3: "Khu vực 3: 25.000đ",
      zone4: "Khu vực 4: 30.000đ",
      zone5: "Khu vực 5: 35.000đ",
    },
    en: {
      title: "Buy Metro Tickets",
      subtitle: "Choose the ticket type that suits your needs",
      selectTicketType: "Select Ticket Type",
      selectStations: "Select Stations",
      quantity: "Quantity",
      total: "Total",
      buyNow: "Buy Now",
      popular: "Popular",
      discount: "Discount",
      features: "Features",
      paymentMethods: "Payment Methods",
      securePayment: "Secure Payment",
      instantDelivery: "Instant Delivery",
      support: "24/7 Support",
      originStation: "Origin Station",
      destinationStation: "Destination Station",
      selectOrigin: "Select origin station",
      selectDestination: "Select destination station",
      calculateFare: "Calculate Fare",
      fareInfo: "Fare Information",
      zoneInfo: "Zone Information",
      selectPayment: "Select Payment Method",
      proceedToPayment: "Proceed to Payment",
      benefits: "Benefits",
      fareCalculation: "Fare Calculation",
      zoneBased: "Zone-based pricing",
      zone1: "Zone 1: 15,000 VND",
      zone2: "Zone 2: 20,000 VND",
      zone3: "Zone 3: 25,000 VND",
      zone4: "Zone 4: 30,000 VND",
      zone5: "Zone 5: 35,000 VND",
    },
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const calculateTotal = () => {
    const selectedTicket = ticketTypes.find(ticket => ticket.id === selectedTicketType);
    if (!selectedTicket) return 0;
    if (selectedTicketType === "single-trip") {
      if (!originStation || !destinationStation) return 0;
      const originStationObj = stations.find(s => s._id === originStation);
      const destinationStationObj = stations.find(s => s._id === destinationStation);
      if (!originStationObj || !destinationStationObj) return 0;
      const originZone = parseInt(originStationObj.zone?.split(' ')[1] || '0');
      const destZone = parseInt(destinationStationObj.zone?.split(' ')[1] || '0');
      const stationCount = Math.abs(originZone - destZone) + 1;
      let basePrice = 0;
      if (stationCount === 1) basePrice = 7000;
      else if (stationCount === 2) basePrice = 9000;
      else if (stationCount === 3) basePrice = 11000;
      else basePrice = 11000 + (stationCount - 3) * 2000;
      basePrice = Math.min(basePrice, 20000);
      if (selectedPaymentMethod === "non-cash") basePrice -= 1000;
      const isElderly = category === "elderly";
      const isChild = category === "child";
      if (
        isElderly ||
        isChild ||
        category === "disabled" ||
        category === "merit"
      ) {
        basePrice = 0;
      }
      return basePrice * quantity;
    }
    if (selectedTicketType === "daily") {
      return selectedTicket.price * quantity;
    }
    if (selectedTicketType === "3-day") {
      return selectedTicket.price * quantity;
    }
    if (selectedTicketType === "monthly") {
      const isElderly = category === "elderly";
      const isChild = category === "child";
      if (
        category === "student" ||
        isElderly ||
        isChild ||
        category === "disabled" ||
        category === "merit"
      ) {
        return 150000 * quantity;
      }
      return 300000 * quantity;
    }
    return selectedTicket.price * quantity;
  };

  const getSelectedTicket = () => {
    return ticketTypes.find(ticket => ticket.id === selectedTicketType);
  };

  const calculateFare = () => {
    if (!originStation || !destinationStation) return 0;
    const originStationObj = stations.find(s => s._id === originStation);
    const destinationStationObj = stations.find(s => s._id === destinationStation);
    if (!originStationObj || !destinationStationObj) return 0;
    const originZone = parseInt(originStationObj.zone?.split(' ')[1] || '0');
    const destZone = parseInt(destinationStationObj.zone?.split(' ')[1] || '0');
    const zoneDiff = Math.abs(originZone - destZone);
    return 15000 + (zoneDiff * 5000);
  };

  const canProceedToPayment = () => {
    return selectedTicketType && originStation && destinationStation && quantity > 0;
  };

  const handlePurchase = async () => {
    try {
      const userId = localStorage.getItem('userId') || '68512e5c26d4cb6370bb5d7d';
      const originStationObj = stations.find(s => s._id === originStation);
      const destinationStationObj = stations.find(s => s._id === destinationStation);
      const payload: any = {
        userId,
        ticketType: selectedTicketType === 'single-trip' ? 'single_ride' : 'time_based',
        paymentMethod: selectedPaymentMethod,
        startStationId: originStationObj ? originStationObj._id : '',
        endStationId: destinationStationObj ? destinationStationObj._id : '',
      };
      if (selectedTicketType === 'daily') payload.duration = 'day';
      if (selectedTicketType === '3-day') payload.duration = '3_day';
      if (selectedTicketType === 'monthly') {
        payload.duration =
          category === 'student' || category === 'elderly' || category === 'child' || category === 'disabled' || category === 'merit'
            ? 'month_student'
            : 'month_adult';
      }
      const result = await purchaseTicket(payload);
      alert('Mua vé thành công!');
    } catch (err: any) {
      alert('Có lỗi khi mua vé: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header removed */}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t[language].title}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t[language].subtitle}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
            <div className="mt-2">
              <Label htmlFor="category" className="mb-2 block">Đối tượng</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Chọn đối tượng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adult">Người lớn</SelectItem>
                  <SelectItem value="elderly">Người cao tuổi (&gt; 60)</SelectItem>
                  <SelectItem value="child">Trẻ em (&lt; 6)</SelectItem>
                  <SelectItem value="student">Học sinh, sinh viên</SelectItem>
                  <SelectItem value="disabled">Người khuyết tật</SelectItem>
                  <SelectItem value="merit">Người có công</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Ticket Types */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                {t[language].selectTicketType}
              </h2>

              <div className="grid md:grid-cols-2 gap-6 items-stretch">
                {ticketTypes.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    <Card
                      className={`h-full flex flex-col cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedTicketType === ticket.id
                          ? 'ring-2 ring-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                        }`}
                      onClick={() => setSelectedTicketType(ticket.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                              {ticket.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {language === "vi" ? ticket.name : ticket.nameEn}
                              </CardTitle>
                              {ticket.popular && (
                                <Badge variant="secondary" className="mt-1">
                                  {t[language].popular}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {ticket.discount && (
                            <Badge variant="destructive" className="text-xs">
                              -{ticket.discount}%
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="pb-3">
                        <p className="text-gray-600 text-sm mb-4">
                          {language === "vi" ? ticket.description : ticket.descriptionEn}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              {formatCurrency(ticket.price)}
                            </span>
                            {ticket.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                {formatCurrency(ticket.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          {(language === "vi" ? ticket.features : ticket.featuresEn).map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Station Selection */}
            {selectedTicketType && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t[language].selectStations}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="origin">{t[language].originStation}</Label>
                    <Select value={originStation} onValueChange={setOriginStation}>
                      <SelectTrigger>
                        <SelectValue placeholder={t[language].selectOrigin} />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station._id} value={station._id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{language === "vi" ? station.name : station.nameEn || station.name}</span>
                              {station.zone && (
                                <Badge variant="outline" className="text-xs">
                                  {station.zone}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="destination">{t[language].destinationStation}</Label>
                    <Select value={destinationStation} onValueChange={setDestinationStation}>
                      <SelectTrigger>
                        <SelectValue placeholder={t[language].selectDestination} />
                      </SelectTrigger>
                      <SelectContent>
                        {stations.map((station) => (
                          <SelectItem key={station._id} value={station._id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{language === "vi" ? station.name : station.nameEn || station.name}</span>
                              {station.zone && (
                                <Badge variant="outline" className="text-xs">
                                  {station.zone}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Fare Information */}
                {originStation && destinationStation && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6"
                  >
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{t[language].fareCalculation}:</strong> {formatCurrency(calculateFare())}
                        <br />
                        <span className="text-sm text-gray-600">{t[language].zoneBased}</span>
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Payment Methods */}
            {canProceedToPayment() && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  {t[language].paymentMethods}
                </h2>

                <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                  <div className="grid gap-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={method.id} id={method.id} />
                        <Label htmlFor={method.id} className="flex items-center gap-3 cursor-pointer">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {method.icon}
                          </div>
                          <div>
                            <div className="font-medium">
                              {language === "vi" ? method.name : method.nameEn}
                            </div>
                            <div className="text-sm text-gray-600">
                              {language === "vi" ? method.description : method.descriptionEn}
                            </div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </motion.div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-8"
            >
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Train className="h-5 w-5" />
                    {t[language].fareInfo}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {selectedTicketType ? (
                    <>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {language === "vi" ? getSelectedTicket()?.name : getSelectedTicket()?.nameEn}
                          </span>
                          <span className="font-medium">
                            {formatCurrency(typeof getSelectedTicket()?.price === 'number' ? getSelectedTicket()?.price! : 0)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <Label htmlFor="quantity">{t[language].quantity}</Label>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setQuantity(quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between text-lg font-semibold">
                          <span>{t[language].total}</span>
                          <span className="text-blue-600">
                            {formatCurrency(typeof calculateTotal() === 'number' ? calculateTotal() : 0)}
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
                        disabled={!canProceedToPayment() || !selectedPaymentMethod}
                        onClick={handlePurchase}
                      >
                        {t[language].proceedToPayment}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Ticket className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>{t[language].selectTicketType}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">{t[language].benefits}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{t[language].securePayment}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <span className="text-sm">{t[language].instantDelivery}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Gift className="h-5 w-5 text-purple-500" />
                    <span className="text-sm">{t[language].support}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Zone Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg">{t[language].zoneInfo}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Zone 1:</span>
                      <span className="font-medium">15.000đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone 2:</span>
                      <span className="font-medium">20.000đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone 3:</span>
                      <span className="font-medium">25.000đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone 4:</span>
                      <span className="font-medium">30.000đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Zone 5:</span>
                      <span className="font-medium">35.000đ</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets; 