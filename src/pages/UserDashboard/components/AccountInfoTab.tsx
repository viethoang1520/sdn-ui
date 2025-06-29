import { updateUserInformation } from "@/apis/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useUserStore } from "@/store/userStore";
import { CreditCard, Edit, LogOut } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface AccountInfoTabProps {
  user: {
    full_name: string
    email: string
    cccd: string
    isAdmin: boolean
    username: string
    passenger_categories: {
      discount: number,
      expiry_date: string,
      passenger_type: string,
      status: string
    }
  },
  activeEdit: boolean
  setActiveEdit: (value: boolean) => void
}

const AccountInfoTab: React.FC<AccountInfoTabProps> = ({ user, activeEdit, setActiveEdit }) => {

  const [userInformation, setUserInformation] = useState(user)
  const fetchUser = useUserStore(state => state.fetchUser)

  useEffect(() => {
    setUserInformation(user)
  }, [user])

  const handleClickSave = async () => {
    const { data } = await updateUserInformation(userInformation)
    if (data.error_code === 0) {
      setActiveEdit(true)
      fetchUser()
      toast.success(data.message)
    } else {
      toast.error(data.message)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin tài khoản</CardTitle>
        <CardDescription>Quản lý thông tin cá nhân và liên kết CCCD</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên</Label>
            <Input id="name" defaultValue={user?.full_name} onChange={(e) => setUserInformation({ ...userInformation, full_name: e.target.value })} disabled={activeEdit} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={user?.email} onChange={(e) => setUserInformation({ ...userInformation, email: e.target.value })} disabled={activeEdit} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Tên đăng nhập</Label>
            <Input id="phone" defaultValue={user?.username} disabled={true} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cccd">Số CCCD</Label>
            <Input id="cccd" defaultValue={user?.cccd} placeholder="Chưa liên kết CCCD" disabled={true} />
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
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">
          <LogOut className="mr-2 h-4 w-4" /> Đăng xuất
        </Button>
        <Button disabled={activeEdit} onClick={handleClickSave}>Lưu thay đổi</Button>
      </CardFooter>
    </Card>
  )
}

export default AccountInfoTab
