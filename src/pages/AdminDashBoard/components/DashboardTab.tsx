import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, LineChart, Users } from "lucide-react";

interface DashboardMetric {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

// interface dataAnalysis {
//   summary: any;
//   allTicketsByMonth: number[];
//   allTicket: number;
//   todayPassengers: number;
//   todayRevenue: number;
//   todayDiscountTickets: number;
// }

interface DashboardTabProps {
  metrics: DashboardMetric[];
  stations: string[];
  language: "vi" | "en";
  dataAnalysis: any; // Adjust type as needed based on your data structure
}

const DashboardTab: React.FC<DashboardTabProps> = ({ metrics, stations, language, dataAnalysis }) => {
  console.log(dataAnalysis?.allTickets);
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            {metric.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className={`text-xs ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}>
              {metric.change >= 0 ? "+" : ""}{metric.change}% {language === "vi" ? "so với hôm qua" : "from yesterday"}
            </p>
          </CardContent>
        </Card>
      ))} */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng vé đã bán</CardTitle>
            <BarChart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataAnalysis?.allTickets}</div>
            {/* <p className={`text-xs ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {metric.change >= 0 ? "+" : ""}{metric.change}% {language === "vi" ? "so với hôm qua" : "from yesterday"}
          </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng vé đã bán</CardTitle>
            <BarChart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataAnalysis?.allTickets}</div>
            {/* <p className={`text-xs ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {metric.change >= 0 ? "+" : ""}{metric.change}% {language === "vi" ? "so với hôm qua" : "from yesterday"}
          </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <BarChart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.todayRevenue).toLocaleString()}</div>
            {/* <p className={`text-xs ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {metric.change >= 0 ? "+" : ""}{metric.change}% {language === "vi" ? "so với hôm qua" : "from yesterday"}
          </p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lượng hành khách</CardTitle>
            <Users className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.todayPassengers).toLocaleString()}</div>
            {/* <p className={`text-xs ${metric.change >= 0 ? "text-green-500" : "text-red-500"}`}>
            {metric.change >= 0 ? "+" : ""}{metric.change}% {language === "vi" ? "so với hôm qua" : "from yesterday"}
          </p> */}
          </CardContent>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{language === "vi" ? "Doanh thu theo ngày" : "Daily Revenue"}</CardTitle>
            <CardDescription>{language === "vi" ? "7 ngày qua" : "Last 7 days"}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
              <LineChart className="h-16 w-16 text-muted" />
              <span className="ml-2 text-muted">{language === "vi" ? "Biểu đồ doanh thu" : "Revenue Chart"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{language === "vi" ? "Lượng hành khách theo ga" : "Passenger Flow by Station"}</CardTitle>
            <CardDescription>{language === "vi" ? "Hôm nay" : "Today"}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <div className="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
              <BarChart className="h-16 w-16 text-muted" />
              <span className="ml-2 text-muted">{language === "vi" ? "Biểu đồ hành khách" : "Passenger Chart"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Station Status */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "vi" ? "Trạng thái các ga" : "Station Status"}</CardTitle>
          <CardDescription>{language === "vi" ? "Cập nhật theo thời gian thực" : "Real-time updates"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stations.slice(0, 6).map((station, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{station}</p>
                  <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 100)} {language === "vi" ? "hành khách" : "passengers"}</p>
                </div>
                <Progress value={Math.floor(Math.random() * 100)} className="w-24" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            {language === "vi" ? "Xem tất cả các ga" : "View all stations"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DashboardTab