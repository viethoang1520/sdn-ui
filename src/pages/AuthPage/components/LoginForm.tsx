import React from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  loginData: { email: string; password: string };
  setLoginData: (data: { email: string; password: string }) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  isLoading: boolean;
  rememberMe: boolean;
  setRememberMe: (remember: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  loginData,
  setLoginData,
  showPassword,
  setShowPassword,
  isLoading,
  rememberMe,
  setRememberMe,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="login-email">Email hoặc Tên đăng nhập</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="login-email"
          type="email"
          placeholder="Nhập email của bạn"
          className="pl-10"
          value={loginData.email}
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
          required
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="login-password">Mật khẩu</Label>
      <div className="relative">
        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          id="login-password"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          className="pl-10 pr-10"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
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
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="remember"
          checked={rememberMe}
          onCheckedChange={(checked) => setRememberMe(!!checked)}
        />
        <Label htmlFor="remember" className="text-sm text-gray-600">
          Ghi nhớ đăng nhập
        </Label>
      </div>
      <button
        type="button"
        className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
      >
        Quên mật khẩu?
      </button>
    </div>
    <Button type="submit" className="w-full" disabled={isLoading}>
      {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
    </Button>
  </form>
);

export default LoginForm; 