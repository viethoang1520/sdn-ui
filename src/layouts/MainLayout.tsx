import React from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronRight } from "lucide-react";
import { Button } from "../components/ui/button";

const Header = () => (
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
        <Button variant="outline" asChild className="hidden md:flex">
          <Link to="/auth">Đăng nhập / Đăng ký</Link>
        </Button>
        {/* Nếu muốn giữ menu mobile tĩnh, có thể để nút này, hoặc xóa luôn */}
      </div>
    </div>
  </header>
);

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
);

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-background">
    <Header />
    {children}
    <Footer />
  </div>
);

export default MainLayout;
