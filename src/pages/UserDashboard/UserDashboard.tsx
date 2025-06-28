import { applyFreeDiscount, applyStudentDiscount } from "@/apis/exemption"
import { getUserInformation } from "@/apis/user"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AccountInfoTab from "./components/AccountInfoTab"
import ActiveTicketsTab from "./components/ActiveTicketsTab"
import ExemptionDialog from "./components/ExemptionDialog"
import PurchaseHistoryTab from "./components/PurchaseHistoryTab"
import QRCodeDialog from "./components/QRCodeDialog"
import UserProfileCard from "./components/UserProfileCard"

interface UserDashboardProps {
  user?: {
    name: string
    email: string
    phone: string
    cccdLinked: boolean
    cccdNumber?: string
    priorityStatus?: string
  }
  purchaseHistory?: PurchaseHistoryItem[]
  activeTickets?: TicketItem[]
}

interface PurchaseHistoryItem {
  id: string
  date: string
  ticketType: string
  stations: string
  amount: string
  paymentMethod: string
}

interface TicketItem {
  id: string
  type: string
  validFrom: string
  validTo: string
  stations: string
  qrCode: string
}

interface QRCodeTicketItem {
  id: string
  type: string
  validFrom: string
  validTo: string
  stations: string
  qrCode: string
}

// Import hoặc định nghĩa lại interface ActiveTicketItem cho đúng file
interface ActiveTicketItem {
  id: string
  transactionId: string
  type: string
  status: string
  createdAt: string
  expiryDate?: string
  basePrice: number
  startStation?: string | null
  endStation?: string | null
}

interface User {
  full_name: string,
  email: string
}

const UserDashboard: React.FC<UserDashboardProps> = () => {
  const [activeEdit, setActiveEdit] = useState<boolean>(true)
  const [activeTab, setActiveTab] = useState("account")
  const [selectedTicket, setSelectedTicket] = useState<QRCodeTicketItem | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showQRDialog, setShowQRDialog] = useState(false)
  const [showExemptionDialog, setShowExemptionDialog] = useState(false)
  const [exemptionForm, setExemptionForm] = useState<{
    priorityGroup: string
    documents: File[]
    validTo?: { month: string; year: string }
  }>({
    priorityGroup: "",
    documents: [],
  })
  const [exemptionStatus, setExemptionStatus] = useState<{
    type: "success" | "error" | null
    message: string
  }>({ type: null, message: "" })
  const [apiPurchaseHistory, setApiPurchaseHistory] = useState<[]>([])
  const [apiActiveTickets, setApiActiveTickets] = useState<ActiveTicketItem[]>([])
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId") || "68512e5c26d4cb6370bb5d7d"

  const priorityGroups = [
    { value: "student", label: "Sinh viên", discount: "50%" },
    { value: "child", label: "Trẻ dưới 6 tuổi", discount: "100%" },
    {
      value: "senior",
      label: "Người trên 60 tuổi",
      discount: "100%",
    },
    { value: "veteran", label: "Cựu chiến binh", discount: "100%" },
  ]

  useEffect(() => {
    const fetch = async () => {
      const { data } = await getUserInformation()
      if (data.error_code === 0) {
        setUser(data.user)
      }
    }
    fetch()
  }, [])

  useEffect(() => {
    if (!userId) {
      navigate("/auth");
    }
  }, [navigate, userId]);

  useEffect(() => {
    fetch(`http://localhost:3000/ticket/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setApiPurchaseHistory(data.data);
        }
      })
      .catch((err) => {
        console.log(err)
        setApiPurchaseHistory([])
      });
  }, [userId])

  useEffect(() => {
    fetch(`http://localhost:3000/ticket/active/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const mapped = data.data.map((item) => ({
            id: item._id,
            transactionId: item.transaction_id,
            type: item.ticket_type?.name || "Không xác định",
            status: item.status,
            createdAt: item.createdAt,
            expiryDate: item.ticket_type?.expiry_date,
            basePrice: item.ticket_type?.base_price ?? 0,
            startStation: item.start_station_name,
            endStation: item.end_station_name,
          }));
          setApiActiveTickets(mapped);
        }
      })
      .catch(() => setApiActiveTickets([]));
  }, [userId]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf"
      );
      setExemptionForm((prev) => ({
        ...prev,
        documents: [...prev.documents, ...newFiles],
      }))
    }
  }

  const removeDocument = (index: number) => {
    setExemptionForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleExemptionSubmit = async () => {
    if (!exemptionForm.priorityGroup || exemptionForm.documents.length === 0) {
      setExemptionStatus({
        type: "error",
        message: "Vui lòng chọn loại đối tượng và đính kèm ít nhất 1 tài liệu.",
      })
      return
    }
    if (exemptionForm.priorityGroup == 'student') {
      const { data } = await applyStudentDiscount(exemptionForm)
      console.log(data)
      if (data.error_code != 0) {
        setExemptionStatus({
          type: "error",
          message: data.message,
        })
        return
      }
    } else {
      const { data } = await applyFreeDiscount(exemptionForm)
      console.log(data)
      if (data.error_code != 0) {
        setExemptionStatus({
          type: "error",
          message: data.message,
        })
        return
      }
    }
    setExemptionStatus({
      type: "success",
      message:
        "Đơn xin miễn/giảm vé đã được nộp thành công. Chúng tôi sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc.",
    });
    setExemptionForm({ priorityGroup: "", documents: [], validTo: undefined })
    setExemptionStatus({ type: null, message: "" })
    setShowExemptionDialog(false)
    alert("Đơn đã gửi thành công")
  }

  const isFormValid =
    exemptionForm.priorityGroup != "" && exemptionForm.documents.length > 0

  return (
    <div className="mt-8">
      <div className="container mx-auto py-6 bg-white">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/3">
            <UserProfileCard
              user={user}
              onEdit={() => {
                setActiveTab("account")
                setActiveEdit(false)
              }}
              onExemption={() => setShowExemptionDialog(true)}
              activeEdit={activeEdit}
            />
          </div>
          <div className="md:w-2/3">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="account">Tài khoản</TabsTrigger>
                <TabsTrigger value="history">Lịch sử mua vé</TabsTrigger>
                <TabsTrigger value="tickets">Vé điện tử</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="mt-6">
                <AccountInfoTab user={user} activeEdit={activeEdit} setActiveEdit={setActiveEdit} />
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <PurchaseHistoryTab purchaseHistory={apiPurchaseHistory} />
              </TabsContent>
              <TabsContent value="tickets" className="mt-6">
                <ActiveTicketsTab
                  activeTickets={apiActiveTickets}
                  onShowQR={(ticket) => {
                    setSelectedTicket({
                      id: ticket.id,
                      type: ticket.type,
                      validFrom: ticket.createdAt
                        ? new Date(ticket.createdAt).toLocaleDateString("vi-VN")
                        : "-",
                      validTo: ticket.expiryDate
                        ? new Date(ticket.expiryDate).toLocaleDateString(
                          "vi-VN"
                        )
                        : "-",
                      stations:
                        ticket.startStation && ticket.endStation
                          ? `${ticket.startStation} - ${ticket.endStation}`
                          : ticket.type,
                      qrCode: ticket.transactionId || "",
                    });
                    setShowQRDialog(true);
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <QRCodeDialog
          open={showQRDialog}
          ticket={selectedTicket}
          onClose={() => setShowQRDialog(false)}
        />
        <ExemptionDialog
          open={showExemptionDialog}
          onClose={() => setShowExemptionDialog(false)}
          exemptionForm={exemptionForm}
          setExemptionForm={setExemptionForm}
          exemptionStatus={exemptionStatus}
          handleFileUpload={handleFileUpload}
          removeDocument={removeDocument}
          handleExemptionSubmit={handleExemptionSubmit}
          isFormValid={isFormValid}
          priorityGroups={priorityGroups}
        />
      </div>
    </div>
  )
}

export default UserDashboard
