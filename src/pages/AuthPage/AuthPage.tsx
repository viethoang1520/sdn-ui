import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import SocialLogin from "./components/SocialLogin";
import { login, register } from "@/apis/authentication";
import { useNavigate } from "react-router";

const AuthPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await login(loginData)
    const token = response.data.token
    console.log(response)
    if (token) {
      localStorage.setItem('token', token)
      console.log("Login token:", localStorage.getItem('token'));
      setIsLoading(false);
      navigate('/')
    } else {
      alert(response.data.message)
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      setIsLoading(false);
      return;
    }
    const response = await register(registerData)
    const data = response.data
    const token = data.token
    if (token) {
      localStorage.setItem('token', token)
      console.log("Register token:", localStorage.getItem('token'));
      setIsLoading(false);
      navigate('/')
    } else {
      alert(response.data.message)
    }
   
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
    // Implement Google OAuth logic here
  };

  const handleFacebookLogin = () => {
    console.log("Facebook login clicked");
    // Implement Facebook OAuth logic here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-start justify-center p-4 pt-10">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Metro Bến Thành - Suối Tiên
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Đăng nhập hoặc tạo tài khoản để tiếp tục
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="register">Đăng ký</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              <LoginForm
                loginData={loginData}
                setLoginData={setLoginData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLoading={isLoading}
                rememberMe={rememberMe}
                setRememberMe={setRememberMe}
                onSubmit={handleLogin}
              />
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              <RegisterForm
                registerData={registerData}
                setRegisterData={setRegisterData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                isLoading={isLoading}
                onSubmit={handleRegister}
              />
            </TabsContent>
          </Tabs>
          <SocialLogin
            onGoogleLogin={handleGoogleLogin}
            onFacebookLogin={handleFacebookLogin}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
