import { ChevronRight, Clock, CreditCard, QrCode, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
const Home = () => {
  const navigate = useNavigate();

  const handleBuyTicket = () => {
    navigate('/ticket-purchase')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-[#003087] text-white py-16 md:py-24">
        <div className="container flex flex-col items-center text-center gap-6">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
            Tuyến Metro Bến Thành - Suối Tiên
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl">
            Mua vé trực tuyến nhanh chóng và tiện lợi
          </p>
          <Button
            size="lg"
            className="mt-4 bg-white text-[#003087] hover:bg-white/90"
            onClick={handleBuyTicket}
          >
            Bắt đầu <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
        </div>
      </section>

      {/* Ticket Types Section */}
      <section className="py-12 md:py-16">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            Loại vé
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Single Trip Ticket */}
            <Card>
              <CardHeader>
                <CardTitle>Vé lượt</CardTitle>
                <CardDescription>Vé một lượt từ 6.000đ đến 20.000đ</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://cellphones.com.vn/sforum/wp-content/uploads/2024/01/metro-th.jpg"
                  alt="Single Trip Ticket"
                  className="rounded-md w-full h-32 object-cover"
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBuyTicket}>Mua ngay</Button>
              </CardFooter>
            </Card>

            {/* Daily Pass */}
            <Card>
              <CardHeader>
                <CardTitle>Vé ngày</CardTitle>
                <CardDescription>Vé không giới hạn trong ngày - 40.000đ</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://i.ex-cdn.com/vntravellive.com/files/news/2024/12/24/hanh-trinh-ket-noi-di-san-sai-gon-cung-metro-so-1-010833.jpg"
                  alt="Daily Pass"
                  className="rounded-md w-full h-32 object-cover"
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBuyTicket}>Mua ngay</Button>
              </CardFooter>
            </Card>

            {/* 3-Day Pass */}
            <Card>
              <CardHeader>
                <CardTitle>Vé 3 ngày</CardTitle>
                <CardDescription>Vé không giới hạn trong 3 ngày - 90.000đ</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://cdn3.ivivu.com/2025/01/467021646_1136269665170394_956958479013069313_n-e1736751361618.jpg"
                  alt="3-Day Pass"
                  className="rounded-md w-full h-32 object-cover"
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBuyTicket}>Mua ngay</Button>
              </CardFooter>
            </Card>

            {/* Monthly Pass */}
            <Card>
              <CardHeader className="relative">
                <Badge className="absolute top-0 right-0 bg-green-600">
                  Mới
                </Badge>
                <CardTitle>Vé tháng</CardTitle>
                <CardDescription>Vé không giới hạn trong tháng - 300.000đ</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://taumetro.com/wp-content/uploads/2024/11/hinh-anh-thuc-te-he-thong-metro-so-1-ben-thanh-suoi-tien-5.jpg"
                  alt="Monthly Pass"
                  className="rounded-md w-full h-32 object-cover"
                />
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleBuyTicket}>Mua ngay</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Stations */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Các trạm</h3>
              </div>
              <p className="text-muted-foreground mb-4">14 trạm từ Bến Thành đến Suối Tiên</p>
              <img
                src="https://images.unsplash.com/photo-1569839333583-7375336cde4b?w=600&q=80"
                alt="Metro Stations Map"
                className="rounded-lg w-full h-64 object-cover"
              />
            </div>

            {/* Payment Methods */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Phương thức thanh toán</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Thẻ tín dụng</span>
                </div>
                <div className="flex items-center gap-3 p-4 border rounded-lg bg-card">
                  <QrCode className="h-5 w-5 text-primary" />
                  <span>Mã QR</span>
                </div>
              </div>

              {/* Account Benefits */}
              <div className="mt-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Lợi ích tài khoản</h3>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>Lịch sử mua vé</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>Vé điện tử</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ChevronRight className="h-4 w-4 text-primary" />
                    <span>Giảm giá ưu tiên</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
