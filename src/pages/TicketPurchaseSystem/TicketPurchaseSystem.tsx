import { payment } from "@/apis/payment"
import { getListStation } from "@/apis/station"
import { purchaseTicketByRoute, purchaseTicketByType } from "@/apis/ticket"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUserStore } from "@/store/userStore"
import type { TicketCategory } from "@/types"
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Train,
} from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

type PaymentMethod = "VNPay" | "visa" | "momo"

interface Station {
  _id: string
  name: string
  distance: number
}

interface TimeLimitedQuantities {
  daily: number
  "three-day": number
  monthly: number
}

const timeLimitedTickets = {
  daily: {
    name: "Vé ngày",
    price: 40000,
    description: "Không giới hạn số lượt đi trong ngày",
  },
  "three-day": {
    name: "Vé 3 ngày",
    price: 90000,
    description: "Không giới hạn số lượt đi trong 3 ngày liên tiếp",
  },
  monthly: {
    name: "Vé tháng",
    price: 300000,
    description: "Không giới hạn số lượt đi trong 30 ngày",
  },
}

interface RouteSelection {
  id: string
  origin: Station | null
  destination: Station | null
  quantity: number
}

export default function TicketPurchaseSystem() {
  const user = useUserStore((state) => state.user)
  const [currentStep, setCurrentStep] = useState(1)
  const [ticketCategory, setTicketCategory] = useState<TicketCategory | null>(null)
  const [timeLimitedQuantities, setTimeLimitedQuantities] = useState<TimeLimitedQuantities>({ daily: 0, "three-day": 0, monthly: 0, })
  const [draftPrice, setDraftPrice] = useState({ price: 0, discount: 0 })
  const [originStation, setOriginStation] = useState<Station | null>(null)
  const [destinationStation, setDestinationStation] = useState<Station | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [dataPayment, setDataPayment] = useState(null)
  const [listStation, setListStation] = useState([])
  const [routeSelections, setRouteSelections] = useState<RouteSelection[]>([
    { id: uuidv4(), origin: null, destination: null, quantity: 1 },
  ])

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getListStation()
      if (data) {
        setListStation(data)
      }
    }
    fetchData()
  }, [])

  const getStepName = (step: number) => {
    switch (step) {
      case 1:
        return "Chọn Loại Vé"
      case 2:
        return ticketCategory === "route" ? "Chọn Ga" : "Chọn Vé"
      case 3:
        return "Thanh Toán"
      case 4:
        return "Xác Nhận"
      default:
        return ""
    }
  }

  const steps = [
    { id: 1, name: "Chọn Loại Vé", active: currentStep >= 1 },
    { id: 2, name: getStepName(2), active: currentStep >= 2 },
    { id: 3, name: "Thanh Toán", active: currentStep >= 3 },
    { id: 4, name: "Xác Nhận", active: currentStep >= 4 },
  ]

  const getSelectedTicketsDisplay = () => {
    if (ticketCategory === "route") {
      return "Vé một lượt"
    }

    const selected = []
    if (timeLimitedQuantities.daily > 0)
      selected.push(`${timeLimitedQuantities.daily} ${timeLimitedTickets.daily.name}`)

    if (timeLimitedQuantities["three-day"] > 0)
      selected.push(`${timeLimitedQuantities["three-day"]} ${timeLimitedTickets["three-day"].name}`)

    if (timeLimitedQuantities.monthly > 0)
      selected.push(`${timeLimitedQuantities.monthly} ${timeLimitedTickets.monthly.name}`)

    return selected.join(", ")
  }

  const canContinueStep1 = () => ticketCategory !== null

  const canContinueStep2 = () => {
    if (ticketCategory === "route") {
      return routeSelections.some(
        (route) =>
          route.origin &&
          route.destination &&
          route.origin._id !== route.destination._id &&
          route.quantity > 0
      )
    }
    return (
      timeLimitedQuantities.daily > 0 ||
      timeLimitedQuantities["three-day"] > 0 ||
      timeLimitedQuantities.monthly > 0
    )
  }

  const canContinueStep3 = () => paymentMethod !== null

  const handleNext = async () => {
    if (currentStep === 2) {
      setShowConfirmDialog(true)
      handleNextStepTwo()
    } else if (currentStep === 3) {
      const { data } = await payment(dataPayment)
      if (data.checkoutUrl) {
        window.open(data.checkoutUrl)
      }
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleConfirmTicket = async () => {
    if (ticketCategory === "route") {
      const validRoutes = routeSelections
        .filter(
          (route) =>
            route.origin &&
            route.destination &&
            route.origin._id !== route.destination._id
        )
        .map((route) => ({
          start_station_id: route.origin._id,
          end_station_id: route.destination._id,
          quantity: route.quantity,
        }))

      if (validRoutes.length > 0) {
        const { data } = await purchaseTicketByRoute(validRoutes, user._id, true)
        if (data.errorCode === 0) {
          setDataPayment({
            transaction_id: data.data.transaction._id,
            items: data.data.tickets,
            total_price: Math.round(data.data.transaction.total_price),
          })
        }
      }
    }

    if (ticketCategory === "time-limited") {
      const ticketInfo = {
        userId: user._id,
        tickets: [
          timeLimitedQuantities.daily > 0 && {
            type: "1day",
            quantity: timeLimitedQuantities.daily,
          },
          timeLimitedQuantities["three-day"] > 0 && {
            type: "3days",
            quantity: timeLimitedQuantities["three-day"],
          },
          timeLimitedQuantities.monthly > 0 && {
            type: "1month",
            quantity: timeLimitedQuantities.monthly,
          },
        ].filter(Boolean),
        confirm: true
      }

      const { data } = await purchaseTicketByType(ticketInfo)
      if (data.data.discount === 100) {
        setCurrentStep(currentStep + 2)
        setShowConfirmDialog(false);
        return
      }

      if (!data.error) {
        setDataPayment({
          transaction_id: data.data.transaction._id,
          items: data.data.tickets,
          total_price: Math.round(data.data.transaction.total_price),
        })
        toast.message(data.message)
      }
    }
    setShowConfirmDialog(false)
    setCurrentStep(currentStep + 1)
  }

  const handleNextStepTwo = async () => {
    if (ticketCategory === "route") {
      const validRoutes = routeSelections
        .filter(
          (route) =>
            route.origin &&
            route.destination &&
            route.origin._id !== route.destination._id
        )
        .map((route) => ({
          start_station_id: route.origin._id,
          end_station_id: route.destination._id,
          quantity: route.quantity,
        }))
      if (validRoutes.length > 0) {
        const { data } = await purchaseTicketByRoute(validRoutes, user._id, false)
        setDraftPrice({ price: Math.round(data.data.origin_price), discount: data.data.discount })
        if (data.errorCode === 0) {
          setDataPayment({
            transaction_id: data.data.transaction._id,
            items: data.data.tickets,
            total_price: Math.round(data.data.transaction.total_price),
          })
        }
      }
    }

    if (ticketCategory === "time-limited") {
      const ticketInfo = {
        userId: user._id,
        tickets: [
          timeLimitedQuantities.daily > 0 && {
            type: "1day",
            quantity: timeLimitedQuantities.daily,
          },
          timeLimitedQuantities["three-day"] > 0 && {
            type: "3days",
            quantity: timeLimitedQuantities["three-day"],
          },
          timeLimitedQuantities.monthly > 0 && {
            type: "1month",
            quantity: timeLimitedQuantities.monthly,
          },
        ].filter(Boolean),
        confirm: false
      }

      const { data } = await purchaseTicketByType(ticketInfo)
      setDraftPrice({ price: Math.round(data.data.origin_price), discount: data.data.discount })

      if (!data.error) {
        setDataPayment({
          transaction_id: data.data.transaction._id,
          items: data.data.tickets,
          total_price: Math.round(data.data.transaction.total_price),
        })
      }
    }
  }

  const handleBack = () => setCurrentStep(currentStep - 1)

  const handleQuantityChange = (
    type: keyof TimeLimitedQuantities,
    value: string
  ) => {
    const numValue = value === "" ? 0 : Number.parseInt(value)
    setTimeLimitedQuantities((prev) => ({
      ...prev,
      [type]: Math.max(0, numValue),
    }))
  }

  const resetForm = () => {
    setCurrentStep(1)
    setTicketCategory(null)
    setTimeLimitedQuantities({ daily: 0, "three-day": 0, monthly: 0 })
    setOriginStation(null)
    setDestinationStation(null)
    setPaymentMethod(null)
  }

  const handleRouteChange = (
    idx: number,
    field: "origin" | "destination" | "quantity",
    value: unknown
  ) => {
    setRouteSelections((prev) =>
      prev.map((route, i) =>
        i === idx
          ? {
            ...route,
            [field]:
              field === "quantity"
                ? Number(value)
                : listStation.find((s) => s._id === value),
          }
          : route
      )
    )
  }

  const addRoute = () => {
    setRouteSelections((prev) => [
      ...prev,
      { id: uuidv4(), origin: null, destination: null, quantity: 1 },
    ])
  }

  const removeRoute = (idx: number) => {
    setRouteSelections((prev) => prev.filter((_, i) => i !== idx))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center mb-6 tracking-wide">
              Hệ Thống Mua Vé Metro
            </CardTitle>

            {/* Progress Indicator */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${currentStep >= step.id
                        ? "bg-white text-blue-600 shadow-lg"
                        : "bg-white/20 text-white/60"
                        }`}
                    >
                      {step.id}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium text-center leading-tight ${currentStep === step.id ? "text-white" : "text-white/70"
                        }`}
                    >
                      {step.name}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-4 rounded-full transition-all ${currentStep > step.id ? "bg-white" : "bg-white/20"
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="min-h-[500px] p-8">
            {/* Step 1: Choose Ticket Category */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-wide">
                    Chọn Loại Vé
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Vui lòng chọn loại vé phù hợp với nhu cầu của bạn
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Route Ticket */}
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${ticketCategory === "route"
                      ? "ring-4 ring-blue-500 border-blue-500 shadow-xl bg-blue-50"
                      : "hover:shadow-lg border-gray-200"
                      }`}
                    onClick={() => setTicketCategory("route")}
                  >
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${ticketCategory === "route"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        <Train className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-gray-800 tracking-wide">
                        Vé Một Lượt
                      </h3>
                      <p className="text-blue-600 font-bold text-lg mb-3">
                        15.000 VND
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Sử dụng cho một lượt đi từ ga xuất phát đến ga đích
                      </p>
                    </CardContent>
                  </Card>

                  {/* Time-Limited Ticket */}
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:scale-105 ${ticketCategory === "time-limited"
                      ? "ring-4 ring-purple-500 border-purple-500 shadow-xl bg-purple-50"
                      : "hover:shadow-lg border-gray-200"
                      }`}
                    onClick={() => setTicketCategory("time-limited")}
                  >
                    <CardContent className="p-8 text-center">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${ticketCategory === "time-limited"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-100 text-gray-600"
                          }`}
                      >
                        <Clock className="w-8 h-8" />
                      </div>
                      <h3 className="font-bold text-xl mb-2 text-gray-800 tracking-wide">
                        Vé Có Thời Hạn
                      </h3>
                      <p className="text-purple-600 font-bold text-lg mb-3">
                        40.000 - 300.000 VND
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Không giới hạn số lượt đi trong khoảng thời gian nhất
                        định
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 2a: Select Stations (for route tickets) */}
            {currentStep === 2 && ticketCategory === "route" && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-wide">
                    Chọn Tuyến Đường
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Chọn các tuyến đường bạn muốn mua và số lượng vé cho mỗi
                    tuyến
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                  {routeSelections.map((route, idx) => (
                    <Card
                      key={route.id}
                      className="relative border-2 border-blue-200 bg-white/80 shadow-md hover:shadow-lg transition-all"
                    >
                      {/* Remove button */}
                      {routeSelections.length > 1 && (
                        <button
                          type="button"
                          className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
                          onClick={() => removeRoute(idx)}
                          aria-label="Xóa tuyến này"
                        >
                          ×
                        </button>
                      )}
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-end gap-6">
                          {/* Origin */}
                          <div className="flex-1">
                            <Label
                              htmlFor={`origin-${route.id}`}
                              className="block mb-2 text-base font-semibold text-gray-700 flex items-center gap-2"
                            >
                              <MapPin className="w-5 h-5 text-green-500" /> Ga
                              Xuất Phát
                            </Label>
                            <Select
                              value={route.origin?._id ?? ""}
                              onValueChange={(value) =>
                                handleRouteChange(idx, "origin", value)
                              }
                            >
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Chọn ga xuất phát" />
                              </SelectTrigger>
                              <SelectContent>
                                {listStation?.map((station) => (
                                  <SelectItem
                                    key={station._id}
                                    value={station._id}
                                    disabled={
                                      route.destination?._id === station._id
                                    }
                                  >
                                    {station.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Arrow */}
                          <div className="flex items-center justify-center pb-4 md:pb-0">
                            <ChevronRight className="w-6 h-6 text-gray-400" />
                          </div>

                          {/* Destination */}
                          <div className="flex-1">
                            <Label
                              htmlFor={`destination-${route.id}`}
                              className="block mb-2 text-base font-semibold text-gray-700 flex items-center gap-2"
                            >
                              <MapPin className="w-5 h-5 text-red-500" /> Ga
                              Đích
                            </Label>
                            <Select
                              value={route.destination?._id ?? ""}
                              onValueChange={(value) =>
                                handleRouteChange(idx, "destination", value)
                              }
                            >
                              <SelectTrigger className="h-12 text-base">
                                <SelectValue placeholder="Chọn ga đích" />
                              </SelectTrigger>
                              <SelectContent>
                                {listStation.map((station) => (
                                  <SelectItem
                                    key={station._id}
                                    value={station._id}
                                    disabled={route.origin?._id === station._id}
                                  >
                                    {station.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Quantity */}
                          <div className="flex flex-col items-start min-w-[120px]">
                            <Label
                              htmlFor={`quantity-${route.id}`}
                              className="mb-2 text-base font-medium text-gray-700"
                            >
                              Số lượng vé
                            </Label>
                            <Select
                              value={route.quantity.toString()}
                              onValueChange={(value) =>
                                handleRouteChange(idx, "quantity", value)
                              }
                            >
                              <SelectTrigger className="w-24 h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 11 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      onClick={addRoute}
                      className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-blue-400 text-blue-700 font-semibold hover:bg-blue-50"
                    >
                      + Thêm tuyến đường
                    </Button>
                  </div>
                  {/* Summary */}
                  <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-700 mb-2">
                      Tóm tắt các tuyến đã chọn:
                    </h3>
                    <ul className="space-y-1 text-gray-700 text-base">
                      {routeSelections.filter(
                        (r) => r.origin && r.destination && r.quantity > 0
                      ).length === 0 ? (
                        <li>Chưa có tuyến nào được chọn.</li>
                      ) : (
                        routeSelections
                          .filter(
                            (r) => r.origin && r.destination && r.quantity > 0
                          )
                          .map((r, i) => (
                            <li key={r.id}>
                              {i + 1}. {r.origin?.name} → {r.destination?.name}{" "}
                              ({r.quantity} vé)
                            </li>
                          ))
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2b: Select Time-Limited Tickets */}
            {currentStep === 2 && ticketCategory === "time-limited" && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-wide">
                    Chọn Vé Có Thời Hạn
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Chọn loại vé và số lượng phù hợp với nhu cầu của bạn
                  </p>
                </div>

                <div className="max-w-3xl mx-auto space-y-6">
                  {Object.entries(timeLimitedTickets).map(([key, ticket]) => (
                    <Card
                      key={key}
                      className="border-2 border-purple-100 bg-purple-50/30 hover:shadow-lg transition-all"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-gray-800 tracking-wide">
                                  {ticket.name}
                                </h3>
                                <p className="text-purple-600 font-semibold">
                                  {ticket.price.toLocaleString()} VND
                                </p>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm ml-13 leading-relaxed">
                              {ticket.description}
                            </p>
                          </div>

                          <div className="ml-6">
                            <Label
                              htmlFor={`${key}-qty`}
                              className="text-sm font-medium text-gray-700 block mb-2"
                            >
                              Số lượng
                            </Label>
                            <Select
                              value={timeLimitedQuantities[
                                key as keyof TimeLimitedQuantities
                              ].toString()}
                              onValueChange={(value) =>
                                handleQuantityChange(
                                  key as keyof TimeLimitedQuantities,
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="w-24 h-10">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 11 }, (_, i) => (
                                  <SelectItem key={i} value={i.toString()}>
                                    {i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 tracking-wide">
                    Chọn Phương Thức Thanh Toán
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    Chọn phương thức thanh toán phù hợp
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-6">
                  <RadioGroup
                    value={paymentMethod || ""}
                    onValueChange={(value) =>
                      setPaymentMethod(value as PaymentMethod)
                    }
                    className="space-y-4"
                  >
                    <Card
                      className={`cursor-pointer transition-all ${paymentMethod === "VNPay"
                        ? "ring-2 ring-blue-500 bg-blue-50"
                        : "hover:shadow-md"
                        }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <RadioGroupItem value="napas" id="napas" />
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                          </div>
                          <Label
                            htmlFor="napas"
                            className="flex-1 cursor-pointer text-lg font-medium"
                          >
                            VNPay
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                  </RadioGroup>

                  <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-xl text-gray-800">
                        Tóm Tắt Thanh Toán
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600">Loại Vé</span>
                        <span className="font-medium text-gray-800">
                          {getSelectedTicketsDisplay()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-xl font-bold text-gray-800">
                          Tổng Cộng
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                          {Number(dataPayment?.total_price).toLocaleString()}{" "}
                          VND
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="text-center space-y-8">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                      Mua Vé Thành Công!
                    </h2>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      Vé của bạn đã được thêm vào tài khoản
                    </p>
                  </div>
                </div>

                {/* QR Code */}
                {/* <div className="flex justify-center">
                  <div className="w-56 h-56 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                    <QRCode value='test value' size={256} />
                  </div>
                </div> */}

                <Card className="max-w-md mx-auto bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 shadow-xl">
                  <CardContent className="p-6">
                    <div className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                      {ticketCategory === "route"
                        ? "Vé một lượt"
                        : "Vé có thời hạn"}
                    </div>

                    <div className="space-y-4 text-left">
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">
                          {ticketCategory === "route"
                            ? "Tuyến Đường"
                            : "Phạm Vi"}
                        </span>
                        <span className="font-semibold text-gray-800">
                          {ticketCategory === "route"
                            ? `${originStation} → ${destinationStation}`
                            : "Tất cả các ga"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-gray-600 font-medium">
                          Giá Vé
                        </span>
                        <span className="font-bold text-blue-600 text-lg">
                          <span>{draftPrice?.price - draftPrice?.price * draftPrice?.discount / 100} VND </span>
                          <span className="line-through">({draftPrice?.price.toLocaleString()} VND)</span>
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-gray-600 font-medium">
                          Mã Giao Dịch
                        </span>
                        <span className="font-mono font-semibold text-gray-800">
                          METRO-
                          {Math.random()
                            .toString(36)
                            .substr(2, 8)
                            .toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  onClick={resetForm}
                  className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Mua Vé Khác
                </Button>
              </div>
            )}

            {/* Confirmation Dialog */}
            <Dialog
              open={showConfirmDialog}
              onOpenChange={setShowConfirmDialog}
            >
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-center text-gray-800">
                    Xác Nhận Thông Tin Vé
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-3">
                      Chi Tiết Vé:
                    </h3>

                    {ticketCategory === "route" && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại vé:</span>
                          <span className="font-medium">Vé một lượt</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-600">Tuyến đường:</span>
                          {routeSelections
                            .filter(
                              (route) =>
                                route.origin &&
                                route.destination &&
                                route.origin._id !== route.destination._id &&
                                route.quantity > 0
                            )
                            .map((route) => (
                              <div
                                key={route.id}
                                className="flex justify-between ml-4"
                              >
                                <span>
                                  • {route.origin?.name} →{" "}
                                  {route.destination?.name}
                                </span>
                                <span>{route.quantity} vé</span>
                              </div>
                            ))}
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600 font-medium">
                            Tổng giá:
                          </span>
                          <span className="font-bold text-blue-600">
                            {
                              draftPrice.discount > 0
                                ?
                                (
                                  <div className="flex flex-col">
                                    <span className="line-through text-xs text-zinc-500 opacity-80">{draftPrice?.price.toLocaleString()} VND</span >
                                    <span className="">{(draftPrice?.price - draftPrice?.price * draftPrice?.discount / 100)} VND</span >
                                  </div>
                                )
                                :
                                (<span>{draftPrice?.price} VND</span >)
                            }
                          </span>
                        </div>
                      </div>
                    )}

                    {ticketCategory === "time-limited" && (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loại vé:</span>
                          <span className="font-medium">Vé có thời hạn</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phạm vi:</span>
                          <span className="font-medium">Tất cả các ga</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-gray-600">Vé đã chọn:</span>
                          {timeLimitedQuantities.daily > 0 && (
                            <div className="flex justify-between ml-4">
                              <span>• Vé ngày:</span>
                              <span>{timeLimitedQuantities.daily} vé</span>
                            </div>
                          )}
                          {timeLimitedQuantities["three-day"] > 0 && (
                            <div className="flex justify-between ml-4">
                              <span>• Vé 3 ngày:</span>
                              <span>
                                {timeLimitedQuantities["three-day"]} vé
                              </span>
                            </div>
                          )}
                          {timeLimitedQuantities.monthly > 0 && (
                            <div className="flex justify-between ml-4">
                              <span>• Vé tháng:</span>
                              <span>{timeLimitedQuantities.monthly} vé</span>
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between border-t pt-2">
                          <span className="text-gray-600 font-medium">
                            Tổng giá:
                          </span>
                          <span className="font-bold text-blue-600">
                            {
                              draftPrice.discount > 0
                                ?
                                (
                                  <div className="flex flex-col">
                                    <span className="line-through text-xs text-zinc-500 opacity-80">{draftPrice?.price.toLocaleString()} VND</span >
                                    <span className="">{(draftPrice?.price - draftPrice?.price * draftPrice?.discount / 100)} VND</span >
                                  </div>
                                )
                                :
                                (<span>{draftPrice?.price} VND</span >)
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 text-center">
                    Vui lòng kiểm tra thông tin và xác nhận để tiếp tục
                  </p>
                </div>

                <DialogFooter className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmDialog(false)}
                    className="flex-1"
                  >
                    Hủy
                  </Button>
                  <Button
                    onClick={handleConfirmTicket}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Xác Nhận
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>

          {/* Navigation Buttons */}
          {currentStep < 4 && (
            <div className="flex justify-between p-8 pt-0">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
                className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 disabled:opacity-50 bg-transparent"
              >
                <ChevronLeft className="w-4 h-4" />
                Quay Lại
              </Button>

              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !canContinueStep1()) ||
                  (currentStep === 2 && !canContinueStep2()) ||
                  (currentStep === 3 && !canContinueStep3())
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp Tục
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
