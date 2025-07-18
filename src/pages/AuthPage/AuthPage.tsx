import { login, register } from "@/apis/authentication"
import { useUserStore } from "@/store/userStore"
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
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

const AuthPage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) navigate('/')
  }, [navigate])
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const fetchUser = useUserStore((state) => state.fetchUser)

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await login(loginData)
      const token = response.data.token
      const isAdmin = response.data.isAdmin

      if (token) {
        if (isAdmin) {
          toast.success('Welcome admin!')
          localStorage.setItem('token', token)
          fetchUser()
          navigate('/admin-dashboard')
        } else {
          toast.success('Login success!')
          localStorage.setItem('token', token)
          fetchUser()
          navigate('/')
        }
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error("Đăng nhập thất bại!")
    }
    setIsLoading(false)
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
      window.location.reload();
    } else {
      toast.error(response.data.message)
      setIsLoading(false);
    }
  }

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
        </CardContent>
      </Card>
    </div>
  )
}

export default AuthPage
