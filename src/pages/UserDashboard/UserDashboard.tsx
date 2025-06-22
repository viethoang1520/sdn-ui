import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserProfileCard from "./components/UserProfileCard";
import AccountInfoTab from "./components/AccountInfoTab";
import PurchaseHistoryTab from "./components/PurchaseHistoryTab";
import ActiveTicketsTab from "./components/ActiveTicketsTab";
import QRCodeDialog from "./components/QRCodeDialog";
import ExemptionDialog from "./components/ExemptionDialog";
import { applyFreeDiscount, applyStudentDiscount } from "@/apis/exemption";

interface UserDashboardProps {
  user?: {
    name: string;
    email: string;
    phone: string;
    cccdLinked: boolean;
    cccdNumber?: string;
    priorityStatus?: string;
  };
  purchaseHistory?: PurchaseHistoryItem[];
  activeTickets?: TicketItem[];
}

interface PurchaseHistoryItem {
  id: string;
  date: string;
  ticketType: string;
  stations: string;
  amount: string;
  paymentMethod: string;
}

interface TicketItem {
  id: string;
  type: string;
  validFrom: string;
  validTo: string;
  stations: string;
  qrCode: string;
}

const UserDashboard: React.FC<UserDashboardProps> = ({
  user = {
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    cccdLinked: true,
    cccdNumber: "079123456789",
    priorityStatus: "Sinh viên",
  },
  purchaseHistory = [],
  activeTickets = [
    {
      id: "TK-67890",
      type: "Vé tháng",
      validFrom: "01/05/2023",
      validTo: "31/05/2023",
      stations: "Bến Thành - Suối Tiên",
      qrCode: "https://api.dicebear.com/7.x/avataaars/svg?seed=ticket-monthly",
    },
    {
      id: "TK-67891",
      type: "Vé ngày",
      validFrom: "15/05/2023",
      validTo: "15/05/2023",
      stations: "Bến Thành - Thảo Điền",
      qrCode: "https://api.dicebear.com/7.x/avataaars/svg?seed=ticket-daily",
    },
  ],
}) => {
  const [activeTab, setActiveTab] = useState("account");
  const [selectedTicket, setSelectedTicket] = useState<TicketItem | null>(null);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showExemptionDialog, setShowExemptionDialog] = useState(false);
  const [exemptionForm, setExemptionForm] = useState<{
    priorityGroup: string;
    documents: File[];
    validTo?: { month: string; year: string };
  }>({
    priorityGroup: "",
    documents: [],
  });
  const [exemptionStatus, setExemptionStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [apiPurchaseHistory, setApiPurchaseHistory] = useState<any[]>([]);
  const [apiActiveTickets, setApiActiveTickets] = useState<TicketItem[]>([]);
  const userId = "68512e5c26d4cb6370bb5d7d"; // TODO: Lấy userId thực tế từ context/auth

  const priorityGroups = [
    { value: "student", label: "Sinh viên", discount: "50%" },
    { value: "child", label: "Trẻ dưới 6 tuổi", discount: "100%" },
    {
      value: "senior",
      label: "Người trên 60 tuổi",
      discount: "100%",
    },
    { value: "veteran", label: "Cựu chiến binh", discount: "100%" },
  ];

  useEffect(() => {
    fetch(`http://localhost:3000/ticket/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          setApiPurchaseHistory(data.data);
        }
      })
      .catch((err) => {
        setApiPurchaseHistory([]);
      });
  }, [userId]);

  useEffect(() => {
    fetch(`http://localhost:3000/ticket/active/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.data) {
          const mapped = data.data.map((item: any) => ({
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
      }));
    }
  };

  const removeDocument = (index: number) => {
    setExemptionForm((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  };

  const handleExemptionSubmit = async () => {
    if (!exemptionForm.priorityGroup || exemptionForm.documents.length === 0) {
      setExemptionStatus({
        type: "error",
        message: "Vui lòng chọn loại đối tượng và đính kèm ít nhất 1 tài liệu.",
      });
      return;
    }
    if (exemptionForm.priorityGroup == 'student') {
      const response = await applyStudentDiscount(exemptionForm)
      if (response.error_code != 0) { 
        setExemptionStatus({
          type: "error",
          message: response.message,
        });
        return;
      }
    } else {
      const response = await applyFreeDiscount(exemptionForm)
      if (response.error_code != 0) { 
        setExemptionStatus({
          type: "error",
          message: response.message,
        });
        return;
      }
    }
    setExemptionStatus({
      type: "success",
      message:
        "Đơn xin miễn/giảm vé đã được nộp thành công. Chúng tôi sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc.",
    });
    setExemptionForm({ priorityGroup: "", documents: [], validTo: undefined });
    setExemptionStatus({ type: null, message: "" });
    setShowExemptionDialog(false);
  };

  const isFormValid =
    exemptionForm.priorityGroup != "" && exemptionForm.documents.length > 0;

  return (
    <div className="mt-8">
      <div className="container mx-auto py-6 bg-white">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/3">
            <UserProfileCard
              user={user}
              onEdit={() => setActiveTab("account")}
              onExemption={() => setShowExemptionDialog(true)}
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
                <AccountInfoTab user={user} />
              </TabsContent>
              <TabsContent value="history" className="mt-6">
                <PurchaseHistoryTab purchaseHistory={apiPurchaseHistory} />
              </TabsContent>
              <TabsContent value="tickets" className="mt-6">
                <ActiveTicketsTab
                  activeTickets={apiActiveTickets}
                  onShowQR={(ticket) => {
                    setSelectedTicket(ticket);
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
  );
};

export default UserDashboard;
