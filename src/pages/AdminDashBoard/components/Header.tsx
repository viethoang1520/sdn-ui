import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Menu, Globe, User } from "lucide-react";

interface HeaderProps {
  language: "vi" | "en";
  setLanguage: (lang: "vi" | "en") => void;
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, activeTab }) => (
  <header className="bg-background border-b shadow-sm p-4 flex justify-between items-center sticky top-0 z-10">
    <div className="md:hidden">
      <Button variant="ghost" size="icon" className="hover:bg-slate-100">
        <Menu className="h-5 w-5" />
      </Button>
    </div>
    <div className="flex-1 md:flex-none md:ml-8">
      <h1 className="text-xl font-bold md:hidden text-primary">
        {language === "vi" ? "Metro HCMC" : "HCMC Metro"}
      </h1>
      <h2 className="text-lg font-semibold hidden md:block">
        {activeTab === "dashboard" && (language === "vi" ? "Tổng quan" : "Dashboard")}
        {activeTab === "fare-management" && (language === "vi" ? "Quản lý giá vé" : "Fare Management")}
        {activeTab === "user-approval" && (language === "vi" ? "Phê duyệt người dùng" : "User Approval")}
        {activeTab === "reports" && (language === "vi" ? "Báo cáo" : "Reports")}
        {activeTab === "station-management" && (language === "vi" ? "Quản lý trạm" : "Station Management")}
        {activeTab === "schedule" && (language === "vi" ? "Lịch trình" : "Schedule")}
        {activeTab === "auto-schedule" && (language === "vi" ? "Tạo lịch trình tự động" : "Auto Create Schedule")}
      </h2>
    </div>
    <div className="flex items-center space-x-4">
      <Select value={language} onValueChange={(value) => setLanguage(value as "vi" | "en")}>
        <SelectTrigger className="w-[100px] border-slate-200">
          <div className="flex items-center">
            <Globe className="h-4 w-4 mr-2 text-slate-500" />
            <SelectValue placeholder="Language" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vi">Tiếng Việt</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center shadow-sm hover:shadow transition-all cursor-pointer">
        <User className="h-5 w-5 text-white" />
      </div>
    </div>
  </header>
);

export default Header; 