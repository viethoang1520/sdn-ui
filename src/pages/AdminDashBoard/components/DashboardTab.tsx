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
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "vi" ? "Tổng doanh thu từ trước đến giờ" : "Total Revenue"}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
              <BarChart className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.totalRevenue ?? 0).toLocaleString()} ₫</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "vi" ? "Tổng cộng từ khi bắt đầu" : "Lifetime earnings"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "vi" ? "Tổng vé đã bán hôm nay" : "Today's Tickets"}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
              <BarChart className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dataAnalysis?.ticketsToday ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "vi" ? "Vé bán trong ngày" : "Tickets sold today"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "vi" ? "Doanh thu hôm nay" : "Today's Revenue"}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-purple-50 flex items-center justify-center">
              <BarChart className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.revenueToday ?? 0).toLocaleString()} ₫</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "vi" ? "Doanh thu trong ngày" : "Revenue today"}
            </p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {language === "vi" ? "Lượng hành khách hôm nay" : "Today's Passengers"}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-orange-50 flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(dataAnalysis?.passengersToday ?? 0).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {language === "vi" ? "Hành khách trong ngày" : "Passengers today"}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-none shadow-md">
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
        <Card className="border-none shadow-md">
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
      <Card className="border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{language === "vi" ? "Trạng thái các ga" : "Station Status"}</CardTitle>
            <CardDescription>{language === "vi" ? "Cập nhật theo thời gian thực" : "Real-time updates"}</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAllStations(!showAllStations)}
            className="text-xs"
          >
            {language === "vi"
              ? (showAllStations ? "Thu gọn" : `Xem tất cả (${stations.length})`)
              : (showAllStations ? "Collapse" : `View all (${stations.length})`)}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleStations.map((station, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div>
                  <p className="font-medium">{station.name}</p>
                  <p className="text-sm text-muted-foreground">{station.count} {language === "vi" ? "hành khách" : "passengers"}</p>
                </div>
                <div className="flex flex-col items-end">
                  <Progress
                    value={station.count}
                    max={Math.max(...stations.map(s => s.count))}
                    className="w-24 h-2 mb-1"
                  />
                  <span className="text-xs text-muted-foreground">{Math.round((station.count / Math.max(...stations.map(s => s.count))) * 100)}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        {stations.length > DEFAULT_VISIBLE && (
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
        )}
      </Card>
    </div>
  );
};

export default DashboardTab;