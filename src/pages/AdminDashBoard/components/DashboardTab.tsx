import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart, Users } from "lucide-react";
import RevenueBarChart from "./RevenueBarChart";
import LollipopChart from "./LollipopChart";

// Removed unused DashboardMetric and commented-out dataAnalysis interface

interface StationStatus {
  name: string;
  count: number;
}
interface DashboardTabProps {
  metrics: any[];
  stations: StationStatus[];
  language: "vi" | "en";
  dataAnalysis: any;
}

const DEFAULT_VISIBLE = 6;

const DashboardTab: React.FC<DashboardTabProps> = ({ metrics, stations, language, dataAnalysis }) => {
  const [showAllStations, setShowAllStations] = React.useState(false);
  const visibleStations = showAllStations ? stations : stations.slice(0, DEFAULT_VISIBLE);
  // Removed unused console.log
  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu từ trước đến giờ</CardTitle>
            <BarChart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.totalRevenue ?? 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Tổng vé đã bán hôm nay</CardTitle>
            <BarChart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataAnalysis?.ticketsToday ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu hôm nay</CardTitle>
            <BarChart className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.revenueToday ?? 0).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lượng hành khách hôm nay</CardTitle>
            <Users className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.passengersToday ?? 0).toLocaleString()}</div>
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
            {dataAnalysis?.revenueLast7Days && dataAnalysis.revenueLast7Days.length > 0 ? (
              <RevenueBarChart data={dataAnalysis.revenueLast7Days} />
            ) : (
              <div className="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
                <span className="ml-2 text-muted">{language === "vi" ? "Không có dữ liệu" : "No data"}</span>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{language === "vi" ? "Tuyến có doanh thu cao nhất" : "Top Routes by Revenue"}</CardTitle>
            <CardDescription>{language === "vi" ? "Top 5 tuyến có doanh thu cao nhất" : "Top 5 routes with highest revenue"}</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {dataAnalysis?.topRoutesByRevenue && dataAnalysis.topRoutesByRevenue.length > 0 ? (
              <LollipopChart data={dataAnalysis.topRoutesByRevenue} language={language} />
            ) : (
              <div className="h-full w-full bg-muted/20 rounded-md flex items-center justify-center">
                <span className="ml-2 text-muted">{language === "vi" ? "Không có dữ liệu" : "No data"}</span>
              </div>
            )}
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
            {visibleStations.map((station, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{station.name}</p>
                  <p className="text-sm text-muted-foreground">{station.count} {language === "vi" ? "hành khách" : "passengers"}</p>
                </div>
                <Progress value={station.count} max={100} className="w-24" />
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowAllStations(!showAllStations)}
          >
            {showAllStations
              ? (language === "vi" ? "Thu gọn" : "Show less")
              : (language === "vi" ? "Xem tất cả các ga" : "View all stations")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default DashboardTab