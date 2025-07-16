import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, Clock, Train, ArrowLeftRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosClient from "@/apis/axiosClient";
import { toast } from "sonner";

export default function AutoCreateSchedule() {
     const [direction, setDirection] = useState<string>("Bến Thành - Suối Tiên");
     const [trainTrips, setTrainTrips] = useState<string>("50");
     const [gapTime, setGapTime] = useState<string>("25");
     const [firstTrain, setFirstTrain] = useState<string>("06:50");
     const [isLoading, setIsLoading] = useState<boolean>(false);

     // Tính toán chuyến cuối cùng
     const calculateLastTrain = (): string => {
          try {
               const [hours, minutes] = firstTrain.split(":").map(Number);
               const totalMinutes = parseInt(trainTrips) * parseInt(gapTime);

               let lastTrainHours = Math.floor(totalMinutes / 60) + hours;
               let lastTrainMinutes = (totalMinutes % 60) + minutes;

               // Xử lý khi phút vượt quá 60
               if (lastTrainMinutes >= 60) {
                    lastTrainHours += Math.floor(lastTrainMinutes / 60);
                    lastTrainMinutes = lastTrainMinutes % 60;
               }

               // Xử lý khi giờ vượt quá 24
               if (lastTrainHours >= 24) {
                    lastTrainHours = lastTrainHours % 24;
               }

               return `${String(lastTrainHours).padStart(2, '0')}:${String(lastTrainMinutes).padStart(2, '0')}`;
          } catch {
               return "--:--";
          }
     }

     const handleSubmit = async () => {
          try {
               setIsLoading(true);

               const response = await axiosClient.post("schedule/auto-create-timetables", {
                    direction,
                    trainTrips: parseInt(trainTrips),
                    gapTime: parseInt(gapTime),
                    firstTrain
               });

               if (response.data.error_code === 0) {
                    toast.success("Đã tạo lịch trình tự động thành công", {
                         position: "top-center",
                         duration: 3000
                    });
               } else {
                    toast.error(`Lỗi: ${response.data.message || "Không thể tạo lịch trình"}`, {
                         position: "top-center",
                         duration: 3000
                    });
               }
          } catch (error) {
               console.error("Lỗi khi tạo lịch trình tự động:", error);
               toast.error("Không thể tạo lịch trình tự động", {
                    position: "top-center",
                    duration: 3000
               });
          } finally {
               setIsLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-white">
               <div className="mx-auto">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                         <div>
                              <h1 className="text-2xl font-bold text-black flex items-center">
                                   <CalendarClock className="h-7 w-7 mr-2 text-blue-600" />
                                   Tạo lịch trình tự động
                              </h1>
                              <p className="text-gray-600 mt-1 ml-9">
                                   Tạo nhiều lịch trình tàu một cách tự động với các thông số tùy chỉnh
                              </p>
                         </div>
                    </div>

                    {/* Main Content */}
                    <Card className="border border-gray-200 rounded-xl shadow-sm">
                         <CardHeader>
                              <CardTitle className="text-lg font-semibold">Thông số tạo lịch trình</CardTitle>
                              <CardDescription>
                                   Điều chỉnh các thông số để tạo lịch trình phù hợp với nhu cầu
                              </CardDescription>
                         </CardHeader>
                         <CardContent>
                              <div className="grid gap-6 md:grid-cols-2">
                                   <div className="space-y-2">
                                        <Label htmlFor="direction" className="font-medium text-gray-700 flex items-center">
                                             <ArrowLeftRight className="h-4 w-4 mr-2 text-blue-600" />
                                             Hướng tuyến
                                        </Label>
                                        <Select value={direction} onValueChange={setDirection}>
                                             <SelectTrigger id="direction" className="border-gray-300 rounded-md">
                                                  <SelectValue placeholder="Chọn hướng tuyến" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectItem value="Bến Thành - Suối Tiên">Bến Thành - Suối Tiên</SelectItem>
                                                  <SelectItem value="Suối Tiên - Bến Thành">Suối Tiên - Bến Thành</SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>

                                   <div className="space-y-2">
                                        <Label htmlFor="trainTrips" className="font-medium text-gray-700 flex items-center">
                                             <Train className="h-4 w-4 mr-2 text-blue-600" />
                                             Số chuyến tàu
                                        </Label>
                                        <Input
                                             id="trainTrips"
                                             type="number"
                                             min="1"
                                             max="100"
                                             value={trainTrips}
                                             onChange={(e) => setTrainTrips(e.target.value)}
                                             className="border-gray-300 rounded-md"
                                        />
                                   </div>

                                   <div className="space-y-2">
                                        <Label htmlFor="gapTime" className="font-medium text-gray-700 flex items-center">
                                             <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                             Khoảng cách giữa các chuyến (phút)
                                        </Label>
                                        <Input
                                             id="gapTime"
                                             type="number"
                                             min="5"
                                             max="60"
                                             value={gapTime}
                                             onChange={(e) => setGapTime(e.target.value)}
                                             className="border-gray-300 rounded-md"
                                        />
                                   </div>

                                   <div className="space-y-2">
                                        <Label htmlFor="firstTrain" className="font-medium text-gray-700 flex items-center">
                                             <CalendarClock className="h-4 w-4 mr-2 text-blue-600" />
                                             Thời gian chuyến đầu tiên
                                        </Label>
                                        <Input
                                             id="firstTrain"
                                             type="time"
                                             value={firstTrain}
                                             onChange={(e) => setFirstTrain(e.target.value)}
                                             className="border-gray-300 rounded-md"
                                        />
                                   </div>
                              </div>

                              <div className="mt-6">
                                   <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                                        <div className="flex">
                                             <div className="flex-shrink-0">
                                                  <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                       <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                  </svg>
                                             </div>
                                             <div className="ml-3 flex-grow">
                                                  <h3 className="text-sm font-medium text-blue-800">Thông tin tạo lịch trình</h3>
                                                  <div className="mt-2 text-sm text-blue-700">
                                                       <ul className="list-disc pl-5 space-y-1">
                                                            <li>Hướng tuyến: <span className="font-medium">{direction}</span></li>
                                                            <li>Số chuyến tàu: <span className="font-medium">{trainTrips} chuyến</span></li>
                                                            <li>Khoảng cách giữa các chuyến: <span className="font-medium">{gapTime} phút</span></li>
                                                            <li>Tổng thời gian hoạt động: <span className="font-medium">
                                                                 {Math.floor(parseInt(trainTrips) * parseInt(gapTime) / 60)} giờ {parseInt(trainTrips) * parseInt(gapTime) % 60} phút
                                                            </span></li>
                                                       </ul>
                                                  </div>

                                                  <div className="mt-4 bg-white rounded-lg border border-blue-100 p-4">
                                                       <div className="flex justify-between items-center mb-3">
                                                            <div className="flex items-center">
                                                                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                      <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                      </svg>
                                                                 </div>
                                                                 <span className="ml-2 font-medium text-gray-700">Chuyến đầu tiên</span>
                                                            </div>
                                                            <span className="font-bold text-lg text-blue-800">{firstTrain}</span>
                                                       </div>

                                                       <div className="relative py-3">
                                                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-200" />
                                                            <div className="flex justify-center">
                                                                 <div className="bg-blue-50 px-3 py-1 rounded-full text-sm text-blue-700">
                                                                      {trainTrips} chuyến • {gapTime} phút/chuyến
                                                                 </div>
                                                            </div>
                                                       </div>

                                                       <div className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                 <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                      <svg className="h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                      </svg>
                                                                 </div>
                                                                 <span className="ml-2 font-medium text-gray-700">Chuyến cuối cùng</span>
                                                            </div>
                                                            <span className="font-bold text-lg text-blue-800">{calculateLastTrain()}</span>
                                                       </div>

                                                       {/* Hiển thị phân bố chuyến tàu trong ngày */}
                                                       <div className="mt-6 border-t border-blue-100 pt-4">
                                                            <h4 className="text-sm font-medium text-blue-800 mb-3">Phân bố chuyến tàu trong ngày</h4>
                                                            <div className="bg-gray-100 h-12 rounded-lg relative overflow-hidden">
                                                                 {/* 24 giờ trong ngày */}
                                                                 {Array.from({ length: 24 }).map((_, i) => (
                                                                      <div
                                                                           key={i}
                                                                           className="absolute top-0 bottom-0 w-px bg-gray-300"
                                                                           style={{ left: `${(i / 24) * 100}%` }}
                                                                      >
                                                                           <div className="absolute -bottom-5 text-xs text-gray-500" style={{ left: '-8px' }}>
                                                                                {i}
                                                                           </div>
                                                                      </div>
                                                                 ))}

                                                                 {/* Hiển thị phạm vi hoạt động */}
                                                                 {firstTrain && trainTrips && gapTime && (
                                                                      (() => {
                                                                           try {
                                                                                const [startHour, startMinute] = firstTrain.split(":").map(Number);
                                                                                const startPercent = ((startHour + startMinute / 60) / 24) * 100;

                                                                                const totalHours = (parseInt(trainTrips) * parseInt(gapTime)) / 60;
                                                                                const endPercent = ((startHour + startMinute / 60 + totalHours) / 24) * 100;

                                                                                // Xử lý trường hợp qua ngày hôm sau
                                                                                const isOvernight = endPercent > 100;
                                                                                const adjustedEndPercent = isOvernight ? endPercent - 100 : endPercent;

                                                                                return (
                                                                                     <>
                                                                                          {!isOvernight ? (
                                                                                               <div
                                                                                                    className="absolute top-0 bottom-0 bg-blue-500 bg-opacity-60"
                                                                                                    style={{
                                                                                                         left: `${startPercent}%`,
                                                                                                         width: `${endPercent - startPercent}%`
                                                                                                    }}
                                                                                               />
                                                                                          ) : (
                                                                                               <>
                                                                                                    <div
                                                                                                         className="absolute top-0 bottom-0 bg-blue-500 bg-opacity-60"
                                                                                                         style={{
                                                                                                              left: `${startPercent}%`,
                                                                                                              width: `${100 - startPercent}%`
                                                                                                         }}
                                                                                                    />
                                                                                                    <div
                                                                                                         className="absolute top-0 bottom-0 bg-blue-500 bg-opacity-60"
                                                                                                         style={{
                                                                                                              left: '0%',
                                                                                                              width: `${adjustedEndPercent}%`
                                                                                                         }}
                                                                                                    />
                                                                                               </>
                                                                                          )}

                                                                                          {/* Chỉ báo chuyến đầu tiên */}
                                                                                          <div
                                                                                               className="absolute top-0 bottom-0 w-1 bg-blue-700"
                                                                                               style={{ left: `${startPercent}%` }}
                                                                                          >
                                                                                               <div className="absolute -top-6 -left-8 text-xs font-semibold text-blue-700 bg-white px-1 rounded">
                                                                                                    {firstTrain}
                                                                                               </div>
                                                                                          </div>

                                                                                          {/* Chỉ báo chuyến cuối cùng */}
                                                                                          <div
                                                                                               className="absolute top-0 bottom-0 w-1 bg-blue-700"
                                                                                               style={{ left: isOvernight ? `${adjustedEndPercent}%` : `${endPercent}%` }}
                                                                                          >
                                                                                               <div className="absolute -top-6 -left-8 text-xs font-semibold text-blue-700 bg-white px-1 rounded">
                                                                                                    {calculateLastTrain()}
                                                                                               </div>
                                                                                          </div>
                                                                                     </>
                                                                                );
                                                                           } catch {
                                                                                return null;
                                                                           }
                                                                      })()
                                                                 )}
                                                            </div>
                                                            <div className="mt-1 text-xs text-gray-500 flex justify-between">
                                                                 <span>00:00</span>
                                                                 <span>12:00</span>
                                                                 <span>23:59</span>
                                                            </div>

                                                            {/* Hiển thị chú thích */}
                                                            <div className="mt-3 text-xs text-gray-700 flex items-center">
                                                                 <div className="w-3 h-3 bg-blue-500 bg-opacity-60 rounded-sm mr-1"></div>
                                                                 <span>Thời gian hoạt động</span>

                                                                 <div className="w-1 h-4 bg-blue-700 ml-4 mr-1"></div>
                                                                 <span>Thời điểm chuyến tàu</span>
                                                            </div>

                                                            {/* Hiển thị danh sách chi tiết các chuyến tàu */}
                                                            <div className="mt-4 pt-3 border-t border-blue-100">
                                                                 <div className="flex justify-between items-center mb-2">
                                                                      <h4 className="text-sm font-medium text-blue-800">Danh sách thời gian chuyến tàu</h4>
                                                                      <div className="text-xs text-gray-500">
                                                                           {parseInt(trainTrips) > 20 ? `Hiển thị 20/${trainTrips} chuyến` : `${trainTrips} chuyến`}
                                                                      </div>
                                                                 </div>

                                                                 <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-2">
                                                                      {(() => {
                                                                           try {
                                                                                const [startHour, startMinute] = firstTrain.split(":").map(Number);
                                                                                const times = [];

                                                                                for (let i = 0; i < Math.min(parseInt(trainTrips), 20); i++) {
                                                                                     const totalMinutes = i * parseInt(gapTime);
                                                                                     let hours = Math.floor(totalMinutes / 60) + startHour;
                                                                                     let minutes = (totalMinutes % 60) + startMinute;

                                                                                     if (minutes >= 60) {
                                                                                          hours += Math.floor(minutes / 60);
                                                                                          minutes = minutes % 60;
                                                                                     }

                                                                                     if (hours >= 24) {
                                                                                          hours = hours % 24;
                                                                                     }

                                                                                     const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

                                                                                     times.push(
                                                                                          <div key={i} className="bg-blue-50 border border-blue-200 rounded-md p-1.5 text-center">
                                                                                               <div className="text-xs font-medium text-blue-800">{timeStr}</div>
                                                                                               <div className="text-xs text-gray-500">#{i + 1}</div>
                                                                                          </div>
                                                                                     );
                                                                                }

                                                                                return times;
                                                                           } catch {
                                                                                return null;
                                                                           }
                                                                      })()}
                                                                 </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>

                                   <Button
                                        onClick={handleSubmit}
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 transition-colors"
                                        disabled={isLoading}
                                   >
                                        {isLoading ? "Đang xử lý..." : "Tạo lịch trình tự động"}
                                   </Button>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     );
}
