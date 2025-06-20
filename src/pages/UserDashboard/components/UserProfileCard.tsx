
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, FileText, CreditCard, Edit, FileCheck } from "lucide-react";

interface UserProfileCardProps {
  user: {
    name: string;
    email: string;
    phone: string;
    cccdLinked: boolean;
    cccdNumber?: string;
    priorityStatus?: string;
  };
  onEdit: () => void;
  onExemption: () => void;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user, onEdit, onExemption }) => (
  <Card>
    <CardHeader className="flex flex-row items-center gap-4">
      <Avatar className="h-16 w-16">
        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt={user.name} />
        <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
      </Avatar>
      <div>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          {user.cccdLinked ? (
            <>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                CCCD Đã liên kết
              </Badge>
              {user.priorityStatus && (
                <Badge className="bg-blue-100 text-blue-800">{user.priorityStatus}</Badge>
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
            ID: {user.cccdNumber || "Chưa liên kết"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FileText size={16} />
          <span className="text-sm text-muted-foreground">{user.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard size={16} />
          <span className="text-sm text-muted-foreground">{user.phone}</span>
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex flex-col gap-2">
      <Button variant="outline" className="w-full" onClick={onEdit}>
        <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa thông tin
      </Button>
      <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={onExemption}>
        <FileCheck className="mr-2 h-4 w-4" /> Nộp đơn xin miễn/giảm vé
      </Button>
    </CardFooter>
  </Card>
);

export default UserProfileCard;
