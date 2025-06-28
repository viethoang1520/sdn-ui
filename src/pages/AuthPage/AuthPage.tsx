import { login, register } from "@/apis/authentication"
import { useUserStore } from "@/store/userStore"
import React, { useState } from "react"
import { useNavigate } from "react-router"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"
import SocialLogin from "./components/SocialLogin"
import { toast } from "sonner"

const AuthPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const fetchUser = useUserStore((state) => state.fetchUser)

  // Login form state
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const response = await login(loginData)
    const token = response.data.token

    if (token) {
      toast.success('Login success!')
      localStorage.setItem('token', token)
      fetchUser()
      setIsLoading(false)
      navigate('/')
    } else {
      toast.error(response.data.message)
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Mật khẩu không khớp!")
      setIsLoading(false)
      return
    }
    const response = await register(registerData)
    const data = response.data
    const error_code = data.error_code
    if (error_code === 0) {
      toast.success(response.data.message)
      setIsLoading(false);
      navigate('/')
    } else {
      toast.error(response.data.message)
      setIsLoading(false);
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
