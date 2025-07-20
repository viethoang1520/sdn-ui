import { applyFreeDiscount, applyStudentDiscount } from "@/apis/exemption";
import {
  getUserActiveTickets,
  getUserInformation,
  getUserPurchaseHistory,
  getUserApplications,
} from "@/apis/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/store/userStore";
import React, { useEffect, useState } from "react";
import AccountInfoTab from "./components/AccountInfoTab";
import ActiveTicketsTab from "./components/ActiveTicketsTab";
import ApplicationsHistoryTab from "./components/ApplicationsHistoryTab";
import ApplicationDetailDialog from "./components/ApplicationDetailDialog";
import ExemptionDialog from "./components/ExemptionDialog";
import PurchaseHistoryTab from "./components/PurchaseHistoryTab";
import QRCodeDialog from "./components/QRCodeDialog";
import UserProfileCard from "./components/UserProfileCard";
import { toast } from "sonner";

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

interface QRCodeTicketItem {
  id: string;
  type: string;
  validFrom: string;
  validTo: string;
  stations: string;
  qrCode: string;
}

interface ActiveTicketItem {
  id: string;
  transactionId: string;
  type: string;
  status: string;
  createdAt: string;
  expiryDate?: string;
  basePrice: number;
  startStation?: string | null;
  endStation?: string | null;
}

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

const UserDashboard: React.FC<UserDashboardProps> = () => {
  const fetchUser = useUserStore(state => state.fetchUser)
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const [activeEdit, setActiveEdit] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState("account");
  const [selectedTicket, setSelectedTicket] = useState<QRCodeTicketItem | null>(
    null
  );
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [showExemptionDialog, setShowExemptionDialog] = useState(false);
  const [showApplicationDetail, setShowApplicationDetail] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
  const [exemptionForm, setExemptionForm] = useState<{
    priorityGroup: string;
    cccd: string;
    validTo?: { month: string; year: string };
  }>({
    priorityGroup: "",
    cccd: "",
  })
  const [exemptionStatus, setExemptionStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [apiPurchaseHistory, setApiPurchaseHistory] = useState<[]>([]);
  const [apiActiveTickets, setApiActiveTickets] = useState<ActiveTicketItem[]>(
    []
  );
  const [apiApplications, setApiApplications] = useState<ApplicationItem[]>([]);

  const userId = user?._id

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
    const fetchPurchaseHistory = async () => {
      try {
        const res = await getUserPurchaseHistory(userId);
        if (res && res.data && res.data.data) {
          setApiPurchaseHistory(res.data.data);
        } else {
          setApiPurchaseHistory([]);
        }
      } catch (err) {
        console.log(err)
        setApiPurchaseHistory([]);
      }
    };
    fetchPurchaseHistory();
  }, [userId]);

  useEffect(() => {
    const fetchActiveTickets = async () => {
      try {
        const res = await getUserActiveTickets(userId);
        if (res && res.data && res.data.data) {
          const mapped = res.data.data.map((item) => ({
            id: item._id,
            transactionId: item.transaction_id,
            type: item.ticket_type?.name || "Vé tuyến",
            status: item.status,
            createdAt: item.createdAt,
            expiryDate: item.ticket_type?.expiry_date,
            basePrice: item.ticket_type?.base_price ?? 0,
            startStation: item.start_station_name,
            endStation: item.end_station_name,
          }));
          setApiActiveTickets(mapped);
        } else {
          setApiActiveTickets([]);
        }
      } catch {
        setApiActiveTickets([]);
      }
    };
    fetchActiveTickets();
  }, [userId]);

  // Fetch user applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getUserApplications();
        console.log('applications', res.data);
        if (res && res.data) {
          setApiApplications(res.data.applications);
        } else {
          setApiApplications([]);
        }
      } catch {
        setApiApplications([]);
      }
    };
    fetchApplications();
  }, [userId]);

  // Function to refresh applications
  const refreshApplications = async () => {
    try {
      const res = await getUserApplications();
      if (res && res.data && res.data.data) {
        setApiApplications(res.data.data);
      } else {
        setApiApplications([]);
      }
    } catch {
      setApiApplications([]);
    }
  };

  const handleExemptionSubmit = async () => {
    if (!exemptionForm.priorityGroup || !exemptionForm.cccd) {
      setExemptionStatus({
        type: "error",
        message: "Vui lòng chọn loại đối tượng và nhập số căn cước công dân.",
      });
      return;
    }
    if (exemptionForm.priorityGroup === "student") {
      const { data } = await applyStudentDiscount(exemptionForm);
      if (data.error_code !== 0) {
        setExemptionStatus({
          type: "error",
          message: data.message,
        });
        return;
      }
    } else {
      const { data } = await applyFreeDiscount(exemptionForm);
      if (data.error_code !== 0) {
        setExemptionStatus({
          type: "error",
          message: data.message,
        });
        return;
      }
    }
    setExemptionStatus({
      type: "success",
      message:
        "Đơn xin miễn/giảm vé đã được nộp thành công. Chúng tôi sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc.",
    });
    setExemptionForm({ priorityGroup: "", cccd: "", validTo: undefined });
    setExemptionStatus({ type: null, message: "" });
    setShowExemptionDialog(false);
    fetchUser();
    refreshApplications(); // Refresh applications after successful submission
    toast.success("Đơn đã gửi thành công");
  };

  const isFormValid = exemptionForm.priorityGroup !== "" && exemptionForm.cccd !== "";

  // Handlers for application detail dialog
  const handleShowApplicationDetail = (application: ApplicationItem) => {
    setSelectedApplication(application);
    setShowApplicationDetail(true);
  };

  const handleCloseApplicationDetail = () => {
    setShowApplicationDetail(false);
    setSelectedApplication(null);
  };

  return (
    <div className="mt-8">
      <div className="container mx-auto py-6 bg-white">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="md:w-1/3">
            <UserProfileCard
              user={user}
              onEdit={() => {
                setActiveTab("account");
                setActiveEdit(false);
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
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="account">Tài khoản</TabsTrigger>
                <TabsTrigger value="history">Lịch sử mua vé</TabsTrigger>
                <TabsTrigger value="tickets">Vé điện tử</TabsTrigger>
                <TabsTrigger value="applications">Đơn ưu đãi</TabsTrigger>
              </TabsList>
              <TabsContent value="account" className="mt-6">
                <AccountInfoTab
                  user={user}
                  activeEdit={activeEdit}
                  setActiveEdit={setActiveEdit}
                />
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
              <TabsContent value="applications" className="mt-6">
                <ApplicationsHistoryTab
                  applications={apiApplications}
                  onShowDetail={handleShowApplicationDetail}
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
          handleExemptionSubmit={handleExemptionSubmit}
          isFormValid={isFormValid}
          priorityGroups={priorityGroups}
        />
        <ApplicationDetailDialog
          open={showApplicationDetail}
          application={selectedApplication}
          onClose={handleCloseApplicationDetail}
        />
      </div>
    </div>
  );
};

export default UserDashboard;