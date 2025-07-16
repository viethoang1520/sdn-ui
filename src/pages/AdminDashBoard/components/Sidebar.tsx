import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart, CreditCard, Users, FileText, Settings, LogOut, Timer, ScanQrCode, CalendarClock } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: "vi" | "en";
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language }) => (
  <div className="hidden md:flex w-64 flex-col bg-card border-r p-4">
    <div className="flex items-center mb-8">
      <div className="h-8 w-8 rounded-full bg-blue-600 mr-3"></div>
      <h1 className="text-xl font-bold">
        {language === "vi" ? "Metro HCMC" : "HCMC Metro"}
      </h1>
    </div>
    <nav className="space-y-1">
      <Button
        variant={activeTab === "dashboard" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveTab("dashboard")}
      >
        <BarChart className="mr-2 h-4 w-4" />
        {language === "vi" ? "Tổng quan" : "Dashboard"}
      </Button>
      <Button
        variant={activeTab === "fare-management" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveTab("fare-management")}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {language === "vi" ? "Quản lý giá vé" : "Fare Management"}
      </Button>
      <Button
        variant={activeTab === "user-approval" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveTab("user-approval")}
      >
        <Users className="mr-2 h-4 w-4" />
        {language === "vi" ? "Phê duyệt đơn" : "User Approval"}
      </Button>
      <Button
        variant={activeTab === "reports" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveTab("reports")}
      >
        <FileText className="mr-2 h-4 w-4" />
        {language === "vi" ? "Báo cáo" : "Reports"}
      </Button>
      <Button
        variant={activeTab === "schedule" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveTab("schedule")}
      >
        <Timer className="mr-2 h-4 w-4" />
        {language === "vi" ? "Lịch trình" : "Schedule"}
      </Button>

      <Button
        variant={activeTab === "auto-schedule" ? "default" : "ghost"}
        className="w-full justify-start"
        onClick={() => setActiveTab("auto-schedule")}
      >
        <CalendarClock className="mr-2 h-4 w-4" />
        {language === "vi" ? "Tạo lịch trình tự động" : "Auto Create Schedule"}
      </Button>

      <Link to='/station-scanner'>
        <Button
          variant={activeTab === "qr" ? "default" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("qr")}
        >
          <ScanQrCode className="mr-2 h-4 w-4" />
          {language === "vi" ? "Quét QR vé" : "QR Ticket Scanner"}
        </Button>
      </Link>
    </nav>
    <div className="mt-auto space-y-1">
      <Button variant="ghost" className="w-full justify-start">
        <Settings className="mr-2 h-4 w-4" />
        {language === "vi" ? "Cài đặt" : "Settings"}
      </Button>
      <Button variant="ghost" className="w-full justify-start">
        <LogOut className="mr-2 h-4 w-4" />
        {language === "vi" ? "Đăng xuất" : "Logout"}
      </Button>
    </div>
  </div>
);

export default Sidebar; 