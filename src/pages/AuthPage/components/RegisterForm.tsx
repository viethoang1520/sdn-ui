import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

interface RegisterFormProps {
  registerData: {
    fullName: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
  setRegisterData: (data: RegisterFormProps["registerData"]) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (show: boolean) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  registerData,
  setRegisterData,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="register-name">Họ và tên</Label>
      <div className="relative">
        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="register-name"
          type="text"
          placeholder="Nhập họ và tên"
          className="pl-10"
          value={registerData.fullName}
          onChange={(e) => setRegisterData({ ...registerData, fullName: e.target.value })}
          required
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="register-username">Username</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="register-username"
          type="username"
          placeholder="Nhập username của bạn"
          className="pl-10"
          value={registerData.username}
          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
          required
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="register-password">Mật khẩu</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="register-password"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          className="pl-10 pr-10"
          value={registerData.password}
          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="register-confirm-password">Xác nhận mật khẩu</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="register-confirm-password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
          className="pl-10 pr-10"
          value={registerData.confirmPassword}
          onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
    </Button>
  </form>
);

export default RegisterForm; 