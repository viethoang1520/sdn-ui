import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from "@/store/userStore";
import { LogOut, Settings, UserCircle } from "lucide-react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

function getInitials(name?: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const Header = () => {
  const user = useUserStore((state) => state.user)
  const setUser = useUserStore((state) => state.setUser)
  const navigate = useNavigate()
  console.log(user)
  const handleLogout = () => {
    localStorage.removeItem('token')
    setUser(null)
    // window.location.reload()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80"
            alt="Metro Logo"
            className="h-8 w-8 rounded-md"
          />
          <span className="font-bold text-lg hidden md:inline-block">
            HCMC Metro
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium text-primary">
            Trang chủ
          </Link>
          <Link
            to="/train-schedule"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Lịch trình
          </Link>
          <Link
            to="/user-dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-primary"
          >
            Tài khoản
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 focus:outline-none">
                  <span className="hidden md:block text-sm font-medium text-foreground">
                    {user?.full_name}
                  </span>
                  <Avatar className="h-10 w-10">
                    {/* {user?.avatarUrl ? (
                      <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                    ) :
                      ( */}
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {getInitials(user?.full_name)}
                    </AvatarFallback>
                    {/* )} */}
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.full_name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/user-dashboard" className="flex items-center">
                    <UserCircle className="mr-2 h-4 w-4" />
                    <span>Tài khoản</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Cài đặt</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" asChild className="hidden md:flex">
              <Link to="/auth">Đăng nhập / Đăng ký</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

const Footer = () => (
  <footer className="border-t py-8 bg-muted/30">
    <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2">
        <img
          src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=50&q=80"
          alt="Metro Logo"
          className="h-8 w-8 rounded-md"
        />
        <span className="font-bold">HCMC Metro</span>
      </div>
      <div className="text-sm text-muted-foreground">
        © 2023 HURC1. Đã đăng ký bản quyền.
      </div>
    </div>
  </footer>
)

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default MainLayout
