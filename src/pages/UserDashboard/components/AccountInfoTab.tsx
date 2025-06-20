import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { CreditCard, Edit, LogOut } from "lucide-react";

interface AccountInfoTabProps {
  user: {
    name: string;
    email: string;
    phone: string;
    cccdNumber?: string;
  };
}

const AccountInfoTab: React.FC<AccountInfoTabProps> = ({ user }) => (
  <Card>
    <CardHeader>
      <CardTitle>Thông tin tài khoản</CardTitle>
      <CardDescription>Quản lý thông tin cá nhân và liên kết CCCD</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          <Input id="name" defaultValue={user.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" defaultValue={user.email} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          <Input id="phone" defaultValue={user.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cccd">Số CCCD</Label>
          <Input id="cccd" defaultValue={user.cccdNumber || ""} placeholder="Nhập số CCCD để liên kết" />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Phương thức thanh toán đã lưu</h3>
          <p className="text-sm text-muted-foreground">Quản lý các phương thức thanh toán của bạn</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 border rounded-md">
            <div className="flex items-center gap-3">
              <CreditCard />
              <div>
                <p className="font-medium">Napas</p>
                <p className="text-sm text-muted-foreground">**** **** **** 1234</p>
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
                <p className="text-sm text-muted-foreground">Liên kết với SĐT: {user.phone}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button variant="outline" className="w-full">
          <CreditCard className="mr-2 h-4 w-4" /> Thêm phương thức thanh toán
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
);

export default AccountInfoTab;
