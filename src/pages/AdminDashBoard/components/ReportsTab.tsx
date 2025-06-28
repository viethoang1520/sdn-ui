import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Filter, Download, LineChart, PieChart, BarChart } from "lucide-react";

interface ReportsTabProps {
  stations: string[];
  language: "vi" | "en";
}

const ReportsTab: React.FC<ReportsTabProps> = ({ stations, language }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold">
        {language === "vi" ? "Báo cáo" : "Reports"}
      </h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{language === "vi" ? "Báo cáo doanh thu" : "Revenue Report"}</CardTitle>
          <CardDescription>{language === "vi" ? "Doanh thu theo ngày, tuần, tháng" : "Revenue by day, week, month"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Select defaultValue="daily">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">{language === "vi" ? "Hàng ngày" : "Daily"}</SelectItem>
                <SelectItem value="weekly">{language === "vi" ? "Hàng tuần" : "Weekly"}</SelectItem>
                <SelectItem value="monthly">{language === "vi" ? "Hàng tháng" : "Monthly"}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-40 bg-muted/20 rounded-md flex items-center justify-center">
            <LineChart className="h-8 w-8 text-muted" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {language === "vi" ? "Xuất báo cáo" : "Export Report"}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{language === "vi" ? "Báo cáo vé" : "Ticket Report"}</CardTitle>
          <CardDescription>{language === "vi" ? "Số lượng vé bán theo loại" : "Ticket sales by type"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{language === "vi" ? "Tất cả các loại" : "All types"}</SelectItem>
                <SelectItem value="single">{language === "vi" ? "Vé một lượt" : "Single Trip"}</SelectItem>
                <SelectItem value="daily">{language === "vi" ? "Vé ngày" : "Daily Pass"}</SelectItem>
                <SelectItem value="three-day">{language === "vi" ? "Vé 3 ngày" : "3-Day Pass"}</SelectItem>
                <SelectItem value="monthly">{language === "vi" ? "Vé tháng" : "Monthly Pass"}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-40 bg-muted/20 rounded-md flex items-center justify-center">
            <PieChart className="h-8 w-8 text-muted" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {language === "vi" ? "Xuất báo cáo" : "Export Report"}
          </Button>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{language === "vi" ? "Báo cáo hành khách" : "Passenger Report"}</CardTitle>
          <CardDescription>{language === "vi" ? "Lượng hành khách theo ga" : "Passenger flow by station"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center space-x-2">
            <Select defaultValue="all-stations">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-stations">{language === "vi" ? "Tất cả các ga" : "All stations"}</SelectItem>
                {stations.map((station, index) => (
                  <SelectItem key={index} value={station.toLowerCase().replace(" ", "-")}>{station}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-40 bg-muted/20 rounded-md flex items-center justify-center">
            <BarChart className="h-8 w-8 text-muted" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {language === "vi" ? "Xuất báo cáo" : "Export Report"}
          </Button>
        </CardFooter>
      </Card>
    </div>
    <Card>
      <CardHeader>
        <CardTitle>{language === "vi" ? "Tạo báo cáo tùy chỉnh" : "Create Custom Report"}</CardTitle>
        <CardDescription>{language === "vi" ? "Tùy chỉnh báo cáo theo nhu cầu của bạn" : "Customize reports based on your needs"}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "vi" ? "Loại báo cáo" : "Report Type"}</label>
            <Select defaultValue="revenue">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">{language === "vi" ? "Doanh thu" : "Revenue"}</SelectItem>
                <SelectItem value="tickets">{language === "vi" ? "Vé" : "Tickets"}</SelectItem>
                <SelectItem value="passengers">{language === "vi" ? "Hành khách" : "Passengers"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "vi" ? "Khoảng thời gian" : "Time Period"}</label>
            <Select defaultValue="last-30-days">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{language === "vi" ? "Hôm nay" : "Today"}</SelectItem>
                <SelectItem value="yesterday">{language === "vi" ? "Hôm qua" : "Yesterday"}</SelectItem>
                <SelectItem value="last-7-days">{language === "vi" ? "7 ngày qua" : "Last 7 days"}</SelectItem>
                <SelectItem value="last-30-days">{language === "vi" ? "30 ngày qua" : "Last 30 days"}</SelectItem>
                <SelectItem value="this-month">{language === "vi" ? "Tháng này" : "This month"}</SelectItem>
                <SelectItem value="last-month">{language === "vi" ? "Tháng trước" : "Last month"}</SelectItem>
                <SelectItem value="custom">{language === "vi" ? "Tùy chỉnh" : "Custom"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "vi" ? "Định dạng" : "Format"}</label>
            <Select defaultValue="pdf">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{language === "vi" ? "Bao gồm biểu đồ" : "Include Charts"}</label>
            <Select defaultValue="yes">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">{language === "vi" ? "Có" : "Yes"}</SelectItem>
                <SelectItem value="no">{language === "vi" ? "Không" : "No"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" />
          {language === "vi" ? "Tạo báo cáo" : "Generate Report"}
        </Button>
      </CardFooter>
    </Card>
  </div>
);

export default ReportsTab; 