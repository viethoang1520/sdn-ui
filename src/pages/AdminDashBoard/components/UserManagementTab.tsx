import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getAllUsers, disableUserById, enableUserById } from "@/apis/admin";

interface User {
  _id: string;
  username: string;
  full_name: string;
  email: string;
  status: number;
  isAdmin: boolean;
  passenger_type: string;
}

const UserManagementTab: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getAllUsers();
      if (data && data.users) {
        setUsers(data.users);
      }
    } catch  {
      toast.error("Lỗi khi lấy danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDisable = async (userId: string) => {
    try {
      await disableUserById(userId);
      toast.success("Đã vô hiệu hóa user");
      fetchUsers();
    } catch {
      toast.error("Vô hiệu hóa thất bại");
    }
  };

  const handleEnable = async (userId: string) => {
    try {
      await enableUserById(userId);
      toast.success("Đã kích hoạt lại user");
      fetchUsers();
    } catch {
      toast.error("Kích hoạt thất bại");
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Quản lý tài khoản người dùng</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên đăng nhập</TableHead>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Loại hành khách</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.passenger_type}</TableCell>
                <TableCell>
                  {user.status === 1 ? (
                    <span className="text-green-600">Đang hoạt động</span>
                  ) : (
                    <span className="text-red-600">Đã vô hiệu hóa</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.status === 1 ? (
                    <Button variant="destructive" size="sm" onClick={() => handleDisable(user._id)}>
                      Vô hiệu hóa
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" onClick={() => handleEnable(user._id)}>
                      Kích hoạt lại
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {loading && <div className="p-4">Đang tải...</div>}
      </div>
    </div>
  );
};

export default UserManagementTab; 