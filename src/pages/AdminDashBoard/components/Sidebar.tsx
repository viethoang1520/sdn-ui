import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart, CreditCard, Users, FileText, Settings, LogOut, Timer, ScanQrCode, CalendarClock, Map, Train } from "lucide-react";
import { Link } from "react-router-dom";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: "vi" | "en";
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, language }) => (
  <div className="hidden md:flex w-64 flex-col bg-card border-r shadow-sm p-4">
    <div className="flex items-center mb-8">
      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mr-3 shadow-sm">
        <Train className="h-5 w-5 text-white" />
      </div>
      <h1 className="text-xl font-bold text-primary">
        {language === "vi" ? "Metro HCMC" : "HCMC Metro"}
      </h1>
    </div>
    <nav className="space-y-1.5">
      <Button
        variant={activeTab === "dashboard" ? "default" : "ghost"}
        className="w-full justify-start font-medium"
        onClick={() => setActiveTab("dashboard")}
      >
        <BarChart className="mr-2 h-4 w-4" />
        {language === "vi" ? "Tổng quan" : "Dashboard"}
      </Button>
      <Button
        variant={activeTab === "user-approval" ? "default" : "ghost"}
        className="w-full justify-start font-medium"
        onClick={() => setActiveTab("user-approval")}
      >
        <Users className="mr-2 h-4 w-4" />
        {language === "vi" ? "Phê duyệt đơn" : "User Approval"}
      </Button>
      <Button
        variant={activeTab === "schedule" ? "default" : "ghost"}
        className="w-full justify-start font-medium"
        onClick={() => setActiveTab("schedule")}
      >
        <Timer className="mr-2 h-4 w-4" />
        {language === "vi" ? "Lịch trình" : "Schedule"}
      </Button>

      <Button
        variant={activeTab === "auto-schedule" ? "default" : "ghost"}
        className="w-full justify-start font-medium"
        onClick={() => setActiveTab("auto-schedule")}
      >
        <CalendarClock className="mr-2 h-4 w-4" />
        {language === "vi" ? "Tạo lịch trình tự động" : "Auto Create Schedule"}
      </Button>

      <Button
        variant={activeTab === "station-management" ? "default" : "ghost"}
        className="w-full justify-start font-medium"
        onClick={() => setActiveTab("station-management")}
      >
        <Map className="mr-2 h-4 w-4" />
        {language === "vi" ? "Quản lý trạm" : "Station Management"}
      </Button>

      <Button
        variant={activeTab === "fare-management" ? "default" : "ghost"}
        className="w-full justify-start font-medium"
        onClick={() => setActiveTab("fare-management")}
      >
        <CreditCard className="mr-2 h-4 w-4" />
        {language === "vi" ? "Quản lý giá vé" : "Fare Management"}
      </Button>

      <Button
        variant={activeTab === "reports" ? "default" : "ghost"}
        className="w-full justify-start font-medium"
        onClick={() => setActiveTab("reports")}
      >
        <FileText className="mr-2 h-4 w-4" />
        {language === "vi" ? "Báo cáo" : "Reports"}
      </Button>

      <Link to='/station-scanner'>
        <Button
          variant={activeTab === "qr" ? "default" : "ghost"}
          className="w-full justify-start font-medium"
          onClick={() => setActiveTab("qr")}
        >
          <ScanQrCode className="mr-2 h-4 w-4" />
          {language === "vi" ? "Quét QR vé" : "QR Ticket Scanner"}
        </Button>
      </Link>
    </nav>

    <div className="mt-auto pt-4 border-t">
      <Button variant="ghost" className="w-full justify-start font-medium mb-1">
        <Settings className="mr-2 h-4 w-4" />
        {language === "vi" ? "Cài đặt" : "Settings"}
      </Button>
      <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 font-medium">
        <LogOut className="mr-2 h-4 w-4" />
        {language === "vi" ? "Đăng xuất" : "Log out"}
      </Button>
    </div>
  </div>
);

export default Sidebar; 