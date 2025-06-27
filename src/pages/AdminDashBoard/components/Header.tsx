import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface HeaderProps {
  language: "vi" | "en";
  setLanguage: (lang: "vi" | "en") => void;
  activeTab: string;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, activeTab }) => (
  <header className="bg-background border-b p-4 flex justify-between items-center sticky top-0 z-10">
    <div className="md:hidden">
      <Button variant="outline" size="icon">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </Button>
    </div>
    <div className="flex-1 md:flex-none md:ml-8">
      <h1 className="text-xl font-bold md:hidden">
        {language === "vi" ? "Metro HCMC" : "HCMC Metro"}
      </h1>
      <h2 className="text-lg font-semibold hidden md:block">
        {activeTab === "dashboard" && (language === "vi" ? "Tổng quan" : "Dashboard")}
        {activeTab === "fare-management" && (language === "vi" ? "Quản lý giá vé" : "Fare Management")}
        {activeTab === "user-approval" && (language === "vi" ? "Phê duyệt người dùng" : "User Approval")}
        {activeTab === "reports" && (language === "vi" ? "Báo cáo" : "Reports")}
      </h2>
    </div>
    <div className="flex items-center space-x-4">
      <Select value={language} onValueChange={(value) => setLanguage(value as "vi" | "en") }>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vi">Tiếng Việt</SelectItem>
          <SelectItem value="en">English</SelectItem>
        </SelectContent>
      </Select>
      <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
        <span className="font-medium text-blue-600">A</span>
      </div>
    </div>
  </header>
);

export default Header; 