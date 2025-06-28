import { getListApproval } from "@/apis/admin"
import {
  BarChart,
  CreditCard,
  FileText,
  Users,
} from "lucide-react";
import React, { useEffect, useState } from "react"
import DashboardTab from "./components/DashboardTab"
import FareManagementTab from "./components/FareManagementTab"
import Header from "./components/Header"
import ReportsTab from "./components/ReportsTab"
import Sidebar from "./components/Sidebar"
import UserApprovalTab from "./components/UserApprovalTab"

interface DashboardMetric {
  title: string
  value: string | number
  change: number
  icon: React.ReactNode
}

interface FareRule {
  id: string
  ticketType: string
  fromStation: string
  toStation: string
  price: number
  discountPrice: number
  active: boolean
}

interface UserApproval {
  _id: string
  user_id: string
  full_name: string
  cccd: string
  user_type: string
  status: "PENDING" | "APPROVED" | "REJECTED"
  dateSubmitted: string
  createdAt: string
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [language, setLanguage] = useState<"vi" | "en">("vi")
  /* CHANGE HERE API */
  const [userApprovals, setUserApprovals] = useState<UserApproval[]>()

  // Mock data for dashboard metrics
  const metrics: DashboardMetric[] = [
    {
      title: language === "vi" ? "Tổng vé đã bán" : "Total Tickets Sold",
      value: "1,245",
      change: 12.5,
      icon: <BarChart className="h-5 w-5 text-blue-600" />,
    },
    {
      title: language === "vi" ? "Doanh thu hôm nay" : "Today's Revenue",
      value: language === "vi" ? "12,450,000 VND" : "12,450,000 VND",
      change: 8.2,
      icon: <CreditCard className="h-5 w-5 text-green-600" />,
    },
    {
      title: language === "vi" ? "Lượng hành khách" : "Passenger Flow",
      value: "3,782",
      change: -2.4,
      icon: <Users className="h-5 w-5 text-orange-600" />,
    },
    {
      title: language === "vi" ? "Vé ưu đãi" : "Discount Tickets",
      value: "428",
      change: 5.1,
      icon: <FileText className="h-5 w-5 text-purple-600" />,
    },
  ]

  // Mock data for fare rules
  const fareRules: FareRule[] = [
    {
      id: "1",
      ticketType: "Single Trip",
      fromStation: "Ben Thanh",
      toStation: "Suoi Tien",
      price: 20000,
      discountPrice: 10000,
      active: true,
    },
    {
      id: "2",
      ticketType: "Daily Pass",
      fromStation: "All Stations",
      toStation: "All Stations",
      price: 40000,
      discountPrice: 20000,
      active: true,
    },
    {
      id: "3",
      ticketType: "3-Day Pass",
      fromStation: "All Stations",
      toStation: "All Stations",
      price: 90000,
      discountPrice: 45000,
      active: true,
    },
    {
      id: "4",
      ticketType: "Monthly Pass",
      fromStation: "All Stations",
      toStation: "All Stations",
      price: 300000,
      discountPrice: 150000,
      active: true,
    },
    {
      id: "5",
      ticketType: "Single Trip",
      fromStation: "Ben Thanh",
      toStation: "Ba Son",
      price: 6000,
      discountPrice: 3000,
      active: true,
    },
  ]

  // Station data
  const stations = [
    "Ben Thanh",
    "Ba Son",
    "Van Thanh",
    "Tan Cang",
    "Thao Dien",
    "An Phu",
    "Rach Chiec",
    "Phuoc Long",
    "Binh Thai",
    "Thu Duc",
    "High Tech Park",
    "Suoi Tien",
    "BXMT",
    "Suoi Tien Terminal",
  ]

  const fetchUserApproval = async () => {
    const { data } = await getListApproval()
    if (data.errorCode === 0) {
      setUserApprovals(data.data.applications)
    }
  }

  useEffect(() => {
    fetchUserApproval()
  }, [])

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <Header language={language} setLanguage={setLanguage} activeTab={activeTab} />
        {/* Dashboard content */}
        <main className="p-4 md:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <DashboardTab metrics={metrics} stations={stations} language={language} />
          )}
          {/* Fare Management Tab */}
          {activeTab === "fare-management" && (
            <FareManagementTab fareRules={fareRules} stations={stations} language={language} />
          )}
          {/* User Approval Tab */}
          {activeTab === "user-approval" && (
            <UserApprovalTab userApprovals={userApprovals} language={language} fetchUserApprove={fetchUserApproval} />
          )}
          {/* Reports Tab */}
          {activeTab === "reports" && (
            <ReportsTab stations={stations} language={language} />
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
