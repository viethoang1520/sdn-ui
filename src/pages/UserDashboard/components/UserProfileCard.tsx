
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Edit, FileCheck, FileText, User } from "lucide-react";
import React from "react";

interface UserProfileCardProps {
  user: {
    full_name: string;
    email: string;
    cccd: string
    isAdmin: boolean,
    passenger_categories: {
      discount: number,
      expiry_date: string,
      passenger_type: string,
      status: string
    }
  }
  onEdit: () => void
  onExemption: () => void
  activeEdit: boolean
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onEdit, onExemption, activeEdit }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.full_name}`} alt={user?.full_name} />
        <AvatarFallback>{user?.full_name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>{user?.full_name}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-2">
          {user?.cccd ? (
            <>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                CCCD Đã liên kết
              </Badge>

              {user?.passenger_categories.passenger_type && (
                <Badge className="bg-blue-100 text-blue-800">{user?.passenger_categories.passenger_type} {user?.passenger_categories.status === 'PENDING' ? '(Đang chờ)' : ''}</Badge>
              )}
            </>
          ) : (
            <Badge variant="outline" className="text-orange-500 border-orange-500">
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
            {user?.cccd || 'Chưa liên kết CCCD'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FileText size={16} />
          <span className="text-sm text-muted-foreground">{user?.email || 'Chưa liên kết email'}</span>
        </div>

        {user?.passenger_categories && user?.passenger_categories?.status !== 'PENDING'
          ?
          <div className="flex items-center gap-2">
            <CreditCard size={16} />
            <span className="text-sm text-muted-foreground">Giảm {user.passenger_categories.discount}%</span>
          </div>
          :
          <span></span>}
      </div>
    </CardContent>
    <CardFooter className="flex flex-col gap-2">
      <Button variant="outline" className="w-full" onClick={onEdit} disabled={!activeEdit}>
        <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
      </Button>
      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onExemption}>
        <FileCheck className="mr-2 h-4 w-4" /> Nộp đơn xin miễn/giảm vé
      </Button>
    </CardFooter>
  </Card>
)

export default UserProfileCard
