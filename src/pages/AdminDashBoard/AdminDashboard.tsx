import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  BarChart,
  LineChart,
  PieChart,
  Users,
  CreditCard,
  FileText,
  Settings,
  LogOut,
  Download,
  Filter,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

interface FareRule {
  id: string;
  ticketType: string;
  fromStation: string;
  toStation: string;
  price: number;
  discountPrice: number;
  active: boolean;
}

interface UserApproval {
  id: string;
  name: string;
  cccd: string;
  type: string;
  status: "pending" | "approved" | "rejected";
  dateSubmitted: string;
}

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [language, setLanguage] = useState<"vi" | "en">("vi");

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
  ];

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
  ];

  // Mock data for user approvals
  const userApprovals: UserApproval[] = [
    {
      id: "1",
      name: "Nguyen Van A",
      cccd: "XXXX-XXXX-1234",
      type: "Student",
      status: "pending",
      dateSubmitted: "15/05/2023",
    },
    {
      id: "2",
      name: "Tran Thi B",
      cccd: "XXXX-XXXX-5678",
      type: "Elderly",
      status: "approved",
      dateSubmitted: "14/05/2023",
    },
    {
      id: "3",
      name: "Le Van C",
      cccd: "XXXX-XXXX-9012",
      type: "Disabled",
      status: "rejected",
      dateSubmitted: "13/05/2023",
    },
    {
      id: "4",
      name: "Pham Thi D",
      cccd: "XXXX-XXXX-3456",
      type: "Student",
      status: "pending",
      dateSubmitted: "12/05/2023",
    },
  ];

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
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
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
            {language === "vi" ? "Phê duyệt người dùng" : "User Approval"}
          </Button>

          <Button
            variant={activeTab === "reports" ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab("reports")}
          >
            <FileText className="mr-2 h-4 w-4" />
            {language === "vi" ? "Báo cáo" : "Reports"}
          </Button>
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

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
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
              {activeTab === "dashboard" &&
                (language === "vi" ? "Tổng quan" : "Dashboard")}
              {activeTab === "fare-management" &&
                (language === "vi" ? "Quản lý giá vé" : "Fare Management")}
              {activeTab === "user-approval" &&
                (language === "vi" ? "Phê duyệt người dùng" : "User Approval")}
              {activeTab === "reports" &&
                (language === "vi" ? "Báo cáo" : "Reports")}
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <Select
              value={language}
              onValueChange={(value) => setLanguage(value as "vi" | "en")}
            >
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

        {/* Dashboard content */}
        <main className="p-4 md:p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">
                        {metric.title}
                      </CardTitle>
                      {metric.icon}
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <p
                        className={`text-xs ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}
                      >
                        {metric.change >= 0 ? "+" : ""}
                        {metric.change}%{" "}
                        {language === "vi"
                          ? "so với hôm qua"
                          : "from yesterday"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === "vi"
                        ? "Doanh thu theo ngày"
                        : "Daily Revenue"}
                    </CardTitle>
                    <CardDescription>
                      {language === "vi" ? "7 ngày qua" : "Last 7 days"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <LineChart className="h-16 w-16 text-muted" />
                      <span className="ml-2 text-muted">
                        {language === "vi"
                          ? "Biểu đồ doanh thu"
                          : "Revenue Chart"}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === "vi"
                        ? "Lượng hành khách theo ga"
                        : "Passenger Flow by Station"}
                    </CardTitle>
                    <CardDescription>
                      {language === "vi" ? "Hôm nay" : "Today"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <div className="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
                      <BarChart className="h-16 w-16 text-muted" />
                      <span className="ml-2 text-muted">
                        {language === "vi"
                          ? "Biểu đồ hành khách"
                          : "Passenger Chart"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Station Status */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {language === "vi" ? "Trạng thái các ga" : "Station Status"}
                  </CardTitle>
                  <CardDescription>
                    {language === "vi"
                      ? "Cập nhật theo thời gian thực"
                      : "Real-time updates"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {stations.slice(0, 6).map((station, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <p className="font-medium">{station}</p>
                          <p className="text-sm text-muted-foreground">
                            {Math.floor(Math.random() * 100)}{" "}
                            {language === "vi" ? "hành khách" : "passengers"}
                          </p>
                        </div>
                        <Progress
                          value={Math.floor(Math.random() * 100)}
                          className="w-24"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    {language === "vi"
                      ? "Xem tất cả các ga"
                      : "View all stations"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}

          {/* Fare Management Tab */}
          {activeTab === "fare-management" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {language === "vi" ? "Quản lý giá vé" : "Fare Management"}
                </h3>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      {language === "vi"
                        ? "Thêm quy tắc giá vé"
                        : "Add Fare Rule"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {language === "vi"
                          ? "Thêm quy tắc giá vé mới"
                          : "Add New Fare Rule"}
                      </DialogTitle>
                      <DialogDescription>
                        {language === "vi"
                          ? "Điền thông tin để tạo quy tắc giá vé mới."
                          : "Fill in the information to create a new fare rule."}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">
                          {language === "vi" ? "Loại vé" : "Ticket Type"}
                        </label>
                        <Select defaultValue="single-trip">
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="single-trip">
                              {language === "vi"
                                ? "Vé một lượt"
                                : "Single Trip"}
                            </SelectItem>
                            <SelectItem value="daily">
                              {language === "vi" ? "Vé ngày" : "Daily Pass"}
                            </SelectItem>
                            <SelectItem value="three-day">
                              {language === "vi" ? "Vé 3 ngày" : "3-Day Pass"}
                            </SelectItem>
                            <SelectItem value="monthly">
                              {language === "vi" ? "Vé tháng" : "Monthly Pass"}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">
                          {language === "vi" ? "Ga đi" : "From Station"}
                        </label>
                        <Select defaultValue="ben-thanh">
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stations.map((station, index) => (
                              <SelectItem
                                key={index}
                                value={station.toLowerCase().replace(" ", "-")}
                              >
                                {station}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">
                          {language === "vi" ? "Ga đến" : "To Station"}
                        </label>
                        <Select defaultValue="suoi-tien">
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {stations.map((station, index) => (
                              <SelectItem
                                key={index}
                                value={station.toLowerCase().replace(" ", "-")}
                              >
                                {station}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">
                          {language === "vi"
                            ? "Giá tiêu chuẩn"
                            : "Standard Price"}
                        </label>
                        <Input
                          type="number"
                          defaultValue="20000"
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <label className="text-right">
                          {language === "vi" ? "Giá ưu đãi" : "Discount Price"}
                        </label>
                        <Input
                          type="number"
                          defaultValue="10000"
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">
                        {language === "vi" ? "Lưu" : "Save"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {language === "vi" ? "Loại vé" : "Ticket Type"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "Ga đi" : "From Station"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "Ga đến" : "To Station"}
                      </TableHead>
                      <TableHead className="text-right">
                        {language === "vi"
                          ? "Giá tiêu chuẩn"
                          : "Standard Price"}
                      </TableHead>
                      <TableHead className="text-right">
                        {language === "vi" ? "Giá ưu đãi" : "Discount Price"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "Trạng thái" : "Status"}
                      </TableHead>
                      <TableHead className="text-right">
                        {language === "vi" ? "Thao tác" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fareRules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell>{rule.ticketType}</TableCell>
                        <TableCell>{rule.fromStation}</TableCell>
                        <TableCell>{rule.toStation}</TableCell>
                        <TableCell className="text-right">
                          {rule.price.toLocaleString()} VND
                        </TableCell>
                        <TableCell className="text-right">
                          {rule.discountPrice.toLocaleString()} VND
                        </TableCell>
                        <TableCell>
                          <Badge variant={rule.active ? "default" : "outline"}>
                            {rule.active
                              ? language === "vi"
                                ? "Đang hoạt động"
                                : "Active"
                              : language === "vi"
                                ? "Không hoạt động"
                                : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button variant="ghost" size="icon">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {language === "vi"
                                      ? "Xác nhận xóa"
                                      : "Confirm Deletion"}
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    {language === "vi"
                                      ? "Bạn có chắc chắn muốn xóa quy tắc giá vé này không? Hành động này không thể hoàn tác."
                                      : "Are you sure you want to delete this fare rule? This action cannot be undone."}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    {language === "vi" ? "Hủy" : "Cancel"}
                                  </AlertDialogCancel>
                                  <AlertDialogAction className="bg-red-500 hover:bg-red-600">
                                    {language === "vi" ? "Xóa" : "Delete"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* User Approval Tab */}
          {activeTab === "user-approval" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {language === "vi" ? "Phê duyệt người dùng" : "User Approval"}
                </h3>

                <div className="flex space-x-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {language === "vi" ? "Tất cả" : "All"}
                      </SelectItem>
                      <SelectItem value="pending">
                        {language === "vi" ? "Đang chờ" : "Pending"}
                      </SelectItem>
                      <SelectItem value="approved">
                        {language === "vi" ? "Đã duyệt" : "Approved"}
                      </SelectItem>
                      <SelectItem value="rejected">
                        {language === "vi" ? "Đã từ chối" : "Rejected"}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {language === "vi" ? "Tên" : "Name"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "CCCD" : "ID Card"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "Loại" : "Type"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "Ngày nộp" : "Date Submitted"}
                      </TableHead>
                      <TableHead>
                        {language === "vi" ? "Trạng thái" : "Status"}
                      </TableHead>
                      <TableHead className="text-right">
                        {language === "vi" ? "Thao tác" : "Actions"}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userApprovals.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.cccd}</TableCell>
                        <TableCell>{user.type}</TableCell>
                        <TableCell>{user.dateSubmitted}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "pending"
                                ? "outline"
                                : user.status === "approved"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {user.status === "pending" &&
                              (language === "vi" ? "Đang chờ" : "Pending")}
                            {user.status === "approved" &&
                              (language === "vi" ? "Đã duyệt" : "Approved")}
                            {user.status === "rejected" &&
                              (language === "vi" ? "Đã từ chối" : "Rejected")}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {user.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-green-500"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon">
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
                                    className="h-4 w-4"
                                  >
                                    <circle cx="12" cy="12" r="1" />
                                    <circle cx="19" cy="12" r="1" />
                                    <circle cx="5" cy="12" r="1" />
                                  </svg>
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {language === "vi"
                                      ? "Chi tiết người dùng"
                                      : "User Details"}
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right font-medium">
                                      {language === "vi" ? "Tên" : "Name"}:
                                    </label>
                                    <span className="col-span-3">
                                      {user.name}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right font-medium">
                                      {language === "vi" ? "CCCD" : "ID Card"}:
                                    </label>
                                    <span className="col-span-3">
                                      {user.cccd}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right font-medium">
                                      {language === "vi" ? "Loại" : "Type"}:
                                    </label>
                                    <span className="col-span-3">
                                      {user.type}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right font-medium">
                                      {language === "vi"
                                        ? "Ngày nộp"
                                        : "Date Submitted"}
                                      :
                                    </label>
                                    <span className="col-span-3">
                                      {user.dateSubmitted}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right font-medium">
                                      {language === "vi"
                                        ? "Trạng thái"
                                        : "Status"}
                                      :
                                    </label>
                                    <span className="col-span-3">
                                      <Badge
                                        variant={
                                          user.status === "pending"
                                            ? "outline"
                                            : user.status === "approved"
                                              ? "default"
                                              : "destructive"
                                        }
                                      >
                                        {user.status === "pending" &&
                                          (language === "vi"
                                            ? "Đang chờ"
                                            : "Pending")}
                                        {user.status === "approved" &&
                                          (language === "vi"
                                            ? "Đã duyệt"
                                            : "Approved")}
                                        {user.status === "rejected" &&
                                          (language === "vi"
                                            ? "Đã từ chối"
                                            : "Rejected")}
                                      </Badge>
                                    </span>
                                  </div>
                                  <Separator />
                                  <div className="grid grid-cols-4 items-center gap-4">
                                    <label className="text-right font-medium">
                                      {language === "vi"
                                        ? "Hình ảnh CCCD"
                                        : "ID Card Image"}
                                      :
                                    </label>
                                    <div className="col-span-3 h-40 bg-muted rounded-md flex items-center justify-center">
                                      <span className="text-muted-foreground">
                                        {language === "vi"
                                          ? "Hình ảnh CCCD"
                                          : "ID Card Image"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {language === "vi" ? "Báo cáo" : "Reports"}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {language === "vi"
                        ? "Báo cáo doanh thu"
                        : "Revenue Report"}
                    </CardTitle>
                    <CardDescription>
                      {language === "vi"
                        ? "Doanh thu theo ngày, tuần, tháng"
                        : "Revenue by day, week, month"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">
                            {language === "vi" ? "Hàng ngày" : "Daily"}
                          </SelectItem>
                          <SelectItem value="weekly">
                            {language === "vi" ? "Hàng tuần" : "Weekly"}
                          </SelectItem>
                          <SelectItem value="monthly">
                            {language === "vi" ? "Hàng tháng" : "Monthly"}
                          </SelectItem>
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
                    <CardTitle>
                      {language === "vi" ? "Báo cáo vé" : "Ticket Report"}
                    </CardTitle>
                    <CardDescription>
                      {language === "vi"
                        ? "Số lượng vé bán theo loại"
                        : "Ticket sales by type"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Select defaultValue="all">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">
                            {language === "vi"
                              ? "Tất cả các loại"
                              : "All types"}
                          </SelectItem>
                          <SelectItem value="single">
                            {language === "vi" ? "Vé một lượt" : "Single Trip"}
                          </SelectItem>
                          <SelectItem value="daily">
                            {language === "vi" ? "Vé ngày" : "Daily Pass"}
                          </SelectItem>
                          <SelectItem value="three-day">
                            {language === "vi" ? "Vé 3 ngày" : "3-Day Pass"}
                          </SelectItem>
                          <SelectItem value="monthly">
                            {language === "vi" ? "Vé tháng" : "Monthly Pass"}
                          </SelectItem>
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
                    <CardTitle>
                      {language === "vi"
                        ? "Báo cáo hành khách"
                        : "Passenger Report"}
                    </CardTitle>
                    <CardDescription>
                      {language === "vi"
                        ? "Lượng hành khách theo ga"
                        : "Passenger flow by station"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Select defaultValue="all-stations">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all-stations">
                            {language === "vi"
                              ? "Tất cả các ga"
                              : "All stations"}
                          </SelectItem>
                          {stations.map((station, index) => (
                            <SelectItem
                              key={index}
                              value={station.toLowerCase().replace(" ", "-")}
                            >
                              {station}
                            </SelectItem>
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
                  <CardTitle>
                    {language === "vi"
                      ? "Tạo báo cáo tùy chỉnh"
                      : "Create Custom Report"}
                  </CardTitle>
                  <CardDescription>
                    {language === "vi"
                      ? "Tùy chỉnh báo cáo theo nhu cầu của bạn"
                      : "Customize reports based on your needs"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === "vi" ? "Loại báo cáo" : "Report Type"}
                      </label>
                      <Select defaultValue="revenue">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="revenue">
                            {language === "vi" ? "Doanh thu" : "Revenue"}
                          </SelectItem>
                          <SelectItem value="tickets">
                            {language === "vi" ? "Vé" : "Tickets"}
                          </SelectItem>
                          <SelectItem value="passengers">
                            {language === "vi" ? "Hành khách" : "Passengers"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === "vi" ? "Khoảng thời gian" : "Time Period"}
                      </label>
                      <Select defaultValue="last-30-days">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">
                            {language === "vi" ? "Hôm nay" : "Today"}
                          </SelectItem>
                          <SelectItem value="yesterday">
                            {language === "vi" ? "Hôm qua" : "Yesterday"}
                          </SelectItem>
                          <SelectItem value="last-7-days">
                            {language === "vi" ? "7 ngày qua" : "Last 7 days"}
                          </SelectItem>
                          <SelectItem value="last-30-days">
                            {language === "vi" ? "30 ngày qua" : "Last 30 days"}
                          </SelectItem>
                          <SelectItem value="this-month">
                            {language === "vi" ? "Tháng này" : "This month"}
                          </SelectItem>
                          <SelectItem value="last-month">
                            {language === "vi" ? "Tháng trước" : "Last month"}
                          </SelectItem>
                          <SelectItem value="custom">
                            {language === "vi" ? "Tùy chỉnh" : "Custom"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        {language === "vi" ? "Định dạng" : "Format"}
                      </label>
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
                      <label className="text-sm font-medium">
                        {language === "vi"
                          ? "Bao gồm biểu đồ"
                          : "Include Charts"}
                      </label>
                      <Select defaultValue="yes">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">
                            {language === "vi" ? "Có" : "Yes"}
                          </SelectItem>
                          <SelectItem value="no">
                            {language === "vi" ? "Không" : "No"}
                          </SelectItem>
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
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
