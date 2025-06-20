import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  CreditCard,
  Download,
  Edit,
  Eye,
  FileText,
  LogOut,
  QrCode,
  Ticket,
  User,
  Upload,
  FileCheck,
} from "lucide-react";

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
  purchaseHistory = [
    {
      id: "TX-12345",
      date: "15/05/2023",
      ticketType: "Vé tháng",
      stations: "Bến Thành - Suối Tiên",
      amount: "150.000 VND",
      paymentMethod: "MoMo",
    },
    {
      id: "TX-12344",
      date: "14/04/2023",
      ticketType: "Vé ngày",
      stations: "Bến Thành - Thảo Điền",
      amount: "40.000 VND",
      paymentMethod: "Napas",
    },
    {
      id: "TX-12343",
      date: "10/04/2023",
      ticketType: "Vé đơn",
      stations: "Bến Thành - Bình Thái",
      amount: "12.000 VND",
      paymentMethod: "Visa",
    },
  ],
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
  const [exemptionForm, setExemptionForm] = useState({
    priorityGroup: "",
    documents: [] as File[],
  });
  const [exemptionStatus, setExemptionStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const priorityGroups = [
    { value: "student", label: "Sinh viên (giảm 50%)", discount: "50%" },
    { value: "child", label: "Trẻ dưới 6 tuổi (miễn phí)", discount: "100%" },
    {
      value: "senior",
      label: "Người trên 60 tuổi (miễn phí)",
      discount: "100%",
    },
    { value: "veteran", label: "Cựu chiến binh (miễn phí)", discount: "100%" },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (file) =>
          file.type.startsWith("image/") || file.type === "application/pdf",
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

  const handleExemptionSubmit = () => {
    if (!exemptionForm.priorityGroup || exemptionForm.documents.length === 0) {
      setExemptionStatus({
        type: "error",
        message: "Vui lòng chọn loại đối tượng và đính kèm ít nhất 1 tài liệu.",
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setExemptionStatus({
        type: "success",
        message:
          "Đơn xin miễn/giảm vé đã được nộp thành công. Chúng tôi sẽ xem xét và phản hồi trong vòng 3-5 ngày làm việc.",
      });

      // Reset form after successful submission
      setTimeout(() => {
        setExemptionForm({ priorityGroup: "", documents: [] });
        setExemptionStatus({ type: null, message: "" });
        setShowExemptionDialog(false);
      }, 3000);
    }, 1000);
  };

  const isFormValid =
    exemptionForm.priorityGroup && exemptionForm.documents.length > 0;

  return (
    <div className="mt-8">
    <div className="container mx-auto py-6 bg-white">
      <div className="flex flex-col md:flex-row gap-6 mb-6">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                  alt={user.name}
                />
                <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {user.cccdLinked ? (
                    <>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        CCCD Đã liên kết
                      </Badge>
                      {user.priorityStatus && (
                        <Badge className="bg-blue-100 text-blue-800">
                          {user.priorityStatus}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-orange-500 border-orange-500"
                    >
                      CCCD Chưa liên kết
                    </Badge>
                  )}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} />
                  <span className="text-sm text-muted-foreground">
                    ID: {user.cccdNumber || "Chưa liên kết"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={16} />
                  <span className="text-sm text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  <span className="text-sm text-muted-foreground">
                    {user.phone}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setActiveTab("account")}
              >
                <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowExemptionDialog(true)}
              >
                <FileCheck className="mr-2 h-4 w-4" /> Nộp đơn xin miễn/giảm vé
              </Button>
            </CardFooter>
          </Card>
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
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin tài khoản</CardTitle>
                  <CardDescription>
                    Quản lý thông tin cá nhân và liên kết CCCD
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input id="name" defaultValue={user.name} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue={user.email}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input id="phone" defaultValue={user.phone} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cccd">Số CCCD</Label>
                      <Input
                        id="cccd"
                        defaultValue={user.cccdNumber || ""}
                        placeholder="Nhập số CCCD để liên kết"
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium">
                        Phương thức thanh toán đã lưu
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Quản lý các phương thức thanh toán của bạn
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <CreditCard />
                          <div>
                            <p className="font-medium">Napas</p>
                            <p className="text-sm text-muted-foreground">
                              **** **** **** 1234
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center gap-3">
                          <CreditCard />
                          <div>
                            <p className="font-medium">MoMo</p>
                            <p className="text-sm text-muted-foreground">
                              Liên kết với SĐT: {user.phone}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      <CreditCard className="mr-2 h-4 w-4" /> Thêm phương thức
                      thanh toán
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">
                    <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
                  </Button>
                  <Button>Lưu thay đổi</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử mua vé</CardTitle>
                  <CardDescription>
                    Xem lại các giao dịch mua vé của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã giao dịch</TableHead>
                          <TableHead>Ngày</TableHead>
                          <TableHead>Loại vé</TableHead>
                          <TableHead>Tuyến</TableHead>
                          <TableHead>Số tiền</TableHead>
                          <TableHead>Thanh toán</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {purchaseHistory.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.id}
                            </TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.ticketType}</TableCell>
                            <TableCell>{item.stations}</TableCell>
                            <TableCell>{item.amount}</TableCell>
                            <TableCell>{item.paymentMethod}</TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" /> Xuất lịch sử giao dịch
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="tickets" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Vé điện tử</CardTitle>
                  <CardDescription>
                    Quản lý vé điện tử hiện có của bạn
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeTickets.map((ticket) => (
                      <Card key={ticket.id} className="overflow-hidden">
                        <CardHeader className="bg-blue-50 pb-2">
                          <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">
                              {ticket.type}
                            </CardTitle>
                            <Badge>{ticket.id}</Badge>
                          </div>
                          <CardDescription>{ticket.stations}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Hiệu lực từ:
                              </span>
                              <span>{ticket.validFrom}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                Hiệu lực đến:
                              </span>
                              <span>{ticket.validTo}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-center">
                              <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowQRDialog(true);
                                }}
                              >
                                <QrCode className="mr-2 h-4 w-4" /> Hiển thị mã
                                QR
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Ticket className="mr-2 h-4 w-4" /> Mua vé mới
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mã QR vé điện tử</DialogTitle>
            <DialogDescription>
              Quét mã QR này tại cổng vào để sử dụng vé của bạn
            </DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg border">
                <img
                  src={selectedTicket.qrCode}
                  alt="QR Code"
                  className="w-64 h-64"
                />
              </div>
              <div className="text-center space-y-1">
                <p className="font-medium">
                  {selectedTicket.type} - {selectedTicket.id}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedTicket.stations}
                </p>
                <p className="text-sm text-muted-foreground">
                  Hiệu lực: {selectedTicket.validFrom} -{" "}
                  {selectedTicket.validTo}
                </p>
              </div>
              <div className="flex items-center text-amber-600 bg-amber-50 p-2 rounded-md text-sm">
                <AlertCircle className="h-4 w-4 mr-2" />
                <span>Vui lòng không chụp màn hình mã QR này</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowQRDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showExemptionDialog} onOpenChange={setShowExemptionDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nộp đơn xin miễn/giảm vé</DialogTitle>
            <DialogDescription>
              Vui lòng chọn loại đối tượng ưu tiên và đính kèm tài liệu chứng
              minh
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {exemptionStatus.type && (
              <Alert
                className={
                  exemptionStatus.type === "success"
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                <AlertCircle
                  className={`h-4 w-4 ${exemptionStatus.type === "success" ? "text-green-600" : "text-red-600"}`}
                />
                <AlertDescription
                  className={
                    exemptionStatus.type === "success"
                      ? "text-green-800"
                      : "text-red-800"
                  }
                >
                  {exemptionStatus.message}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="priority-group">Loại đối tượng ưu tiên *</Label>
              <Select
                value={exemptionForm.priorityGroup}
                onValueChange={(value) =>
                  setExemptionForm((prev) => ({
                    ...prev,
                    priorityGroup: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại đối tượng" />
                </SelectTrigger>
                <SelectContent>
                  {priorityGroups.map((group) => (
                    <SelectItem key={group.value} value={group.value}>
                      {group.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="documents">Tài liệu chứng minh *</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Nhấn để tải lên</span>{" "}
                        hoặc kéo thả file
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, PDF (tối đa 10MB mỗi file)
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>

                {exemptionForm.documents.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tài liệu đã chọn:</p>
                    {exemptionForm.documents.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm truncate max-w-[200px]">
                            {file.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {exemptionForm.priorityGroup && (
              <div className="p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  <strong>Mức ưu đãi:</strong>{" "}
                  {priorityGroups.find(
                    (g) => g.value === exemptionForm.priorityGroup,
                  )?.discount === "100%"
                    ? "Miễn phí"
                    : "Giảm 50%"}
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowExemptionDialog(false);
                setExemptionForm({ priorityGroup: "", documents: [] });
                setExemptionStatus({ type: null, message: "" });
              }}
              className="w-full sm:w-auto"
            >
              Hủy
            </Button>
            <Button
              onClick={handleExemptionSubmit}
              disabled={!isFormValid || exemptionStatus.type === "success"}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {exemptionStatus.type === "success" ? "Đã nộp" : "Nộp đơn"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
      </div>
  );
};

export default UserDashboard;
