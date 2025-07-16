import { getListTimetable, updateTimetableById, deleteTimetableById } from "@/apis/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Filter, MoreHorizontal, Trash2, RefreshCcw } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface TimeSlot {
     id: string
     time: string
     title: string
     type: "MEETING" | "BREAK" | "WORK" | "EVENT"
     status: "ACTIVE" | "INACTIVE" | "PENDING"
     date: string
}

export default function ScheduleManagement() {
     const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

     const fetchListTimetable = async () => {
          const data = await getListTimetable()
          const mapped = (data.data.data || []).map((item) => ({
               id: item._id,
               time: item.start_time,
               title: item.title || "",
               type:
                    item.type === 0
                         ? "MEETING"
                         : item.type === 1
                              ? "WORK"
                              : item.type === 2
                                   ? "BREAK"
                                   : "EVENT",
               status:
                    item.status === 1
                         ? "ACTIVE"
                         : item.status === 0
                              ? "INACTIVE"
                              : "PENDING",
               date: item.date || "",
          }))
          setTimeSlots(mapped)
     }

     useEffect(() => {
          fetchListTimetable()
     }, [])

     const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)
     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
     const [editTime, setEditTime] = useState("")
     const [editTitle, setEditTitle] = useState("")
     const [editType, setEditType] = useState<TimeSlot["type"]>("WORK")
     const [editStatus, setEditStatus] = useState<TimeSlot["status"]>("ACTIVE")
     const [filterStatus, setFilterStatus] = useState<string>("all")

     const getStatusBadge = (status: TimeSlot["status"]) => {
          switch (status) {
               case "ACTIVE":
                    return (
                         <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white font-medium px-3 py-1 rounded-full">
                              <span className="flex items-center">
                                   <span className="h-2 w-2 rounded-full bg-white mr-1.5 inline-block"></span>
                                   Đang hoạt động
                              </span>
                         </Badge>
                    )
               case "INACTIVE":
                    return (
                         <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white font-medium px-3 py-1 rounded-full">
                              <span className="flex items-center">
                                   <span className="h-2 w-2 rounded-full bg-white mr-1.5 inline-block opacity-60"></span>
                                   Không hoạt động
                              </span>
                         </Badge>
                    )
               case "PENDING":
                    return (
                         <Badge variant="outline" className="border-amber-500 text-amber-600 font-medium px-3 py-1 rounded-full">
                              <span className="flex items-center">
                                   <span className="h-2 w-2 rounded-full bg-amber-500 mr-1.5 inline-block animate-pulse"></span>
                                   Đang chờ
                              </span>
                         </Badge>
                    )
               default:
                    return <Badge variant="outline">{status}</Badge>
          }
     }

     const timeToMinutes = (time: string): number => {
          const [hours, minutes] = time.split(":").map(Number)
          return hours * 60 + minutes
     }

     const validateTimeEdit = (newTime: string, currentId: string): boolean => {
          const newTimeMinutes = timeToMinutes(newTime)
          const sortedSlots = timeSlots
               .filter((slot) => slot.id !== currentId)
               .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))

          const currentIndex = sortedSlots.findIndex((slot) => timeToMinutes(slot.time) > newTimeMinutes)

          if (currentIndex === 0) {
               return newTimeMinutes < timeToMinutes(sortedSlots[0].time)
          } else if (currentIndex === -1) {
               return newTimeMinutes > timeToMinutes(sortedSlots[sortedSlots.length - 1].time)
          } else {
               const prevTime = timeToMinutes(sortedSlots[currentIndex - 1].time)
               const nextTime = timeToMinutes(sortedSlots[currentIndex].time)
               return newTimeMinutes > prevTime && newTimeMinutes < nextTime
          }
     }

     const handleEdit = (slot: TimeSlot) => {
          setEditingSlot(slot)
          setEditTime(slot.time)
          setEditTitle(slot.title)
          setEditType(slot.type)
          setEditStatus(slot.status)
          setIsEditDialogOpen(true)
     }

     const handleSaveEdit = async () => {
          if (!editingSlot) return

          if (!validateTimeEdit(editTime, editingSlot.id)) {
               toast.error("Thời gian không được vượt quá giờ trước hoặc giờ sau", {
                    position: 'top-center',
                    duration: 3000,
               })
               return
          }

          try {
               const updatedData = {
                    start_time: editTime,
                    title: editTitle,
                    type: editType === "MEETING" ? 0 : editType === "WORK" ? 1 : editType === "BREAK" ? 2 : 3,
                    status: editStatus === "ACTIVE" ? 1 : editStatus === "INACTIVE" ? 0 : 2,
               }

               await updateTimetableById(editingSlot.id, updatedData)

               const updatedSlots = timeSlots.map((slot) =>
                    slot.id === editingSlot.id
                         ? { ...slot, time: editTime, title: editTitle, type: editType, status: editStatus }
                         : slot,
               )

               setTimeSlots(updatedSlots)
               setIsEditDialogOpen(false)
               setEditingSlot(null)

               toast.success("Đã cập nhật lịch trình", {
                    position: 'top-center',
                    duration: 3000,
               })
          } catch (error) {
               console.error("Lỗi khi cập nhật lịch trình:", error)
               toast.error("Không thể cập nhật lịch trình", {
                    position: 'top-center',
                    duration: 3000,
               })
          }
     }

     const handleDelete = async (id: string) => {
          try {
               // Sử dụng API delete thay vì update status
               await deleteTimetableById(id)

               // Cập nhật UI
               const updatedSlots = timeSlots.map((slot) =>
                    slot.id === id
                         ? { ...slot, status: "INACTIVE" as TimeSlot["status"] }
                         : slot
               )

               setTimeSlots(updatedSlots)

               toast.success("Đã vô hiệu hóa lịch trình", {
                    position: 'top-center',
                    duration: 3000,
               })
          } catch (error) {
               console.error("Lỗi khi vô hiệu hóa lịch trình:", error)
               toast.error("Không thể vô hiệu hóa lịch trình", {
                    position: 'top-center',
                    duration: 3000,
               })
          }
     }

     const handleRestoreTimeSlot = async (id: string) => {
          try {
               // Cập nhật trạng thái sang ACTIVE
               const updatedData = {
                    status: 1 // 1 tương ứng với ACTIVE
               }

               await updateTimetableById(id, updatedData)

               // Cập nhật UI
               const updatedSlots = timeSlots.map((slot) =>
                    slot.id === id
                         ? { ...slot, status: "ACTIVE" as TimeSlot["status"] }
                         : slot
               )

               setTimeSlots(updatedSlots)

               toast.success("Đã kích hoạt lại lịch trình", {
                    position: 'top-center',
                    duration: 3000,
               })
          } catch (error) {
               console.error("Lỗi khi kích hoạt lại lịch trình:", error)
               toast.error("Không thể kích hoạt lại lịch trình", {
                    position: 'top-center',
                    duration: 3000,
               })
          }
     }

     const filteredTimeSlots =
          filterStatus === "all" ? timeSlots : timeSlots.filter((slot) => slot.status === filterStatus)

     // Sắp xếp lịch trình theo thời gian tăng dần
     const sortedTimeSlots = [...filteredTimeSlots].sort((a, b) => {
          // Chuyển đổi thời gian sang số phút từ 00:00
          const toMinutes = (timeStr: string): number => {
               const [hours, minutes] = timeStr.split(":").map(Number)
               // Nếu giờ là từ 0-3, coi như nó thuộc về ngày tiếp theo (sau nửa đêm)
               // để đảm bảo thứ tự đúng: 22:00, 23:00, 00:15, 01:30...
               if (hours >= 0 && hours < 4) {
                    return (hours + 24) * 60 + minutes
               }
               return hours * 60 + minutes
          }

          return toMinutes(a.time) - toMinutes(b.time)
     })

     return (
          <div className="min-h-screen bg-white">
               <div className="mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                         <div>
                              <h1 className="text-2xl font-bold text-black flex items-center">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                   </svg>
                                   Quản lý lịch trình
                              </h1>
                              <p className="text-gray-600 mt-1 ml-9">Quản lý và điều chỉnh lịch trình hàng ngày</p>
                         </div>
                         <div className="flex items-center gap-4">
                              <Select value={filterStatus} onValueChange={setFilterStatus}>
                                   <SelectTrigger className="w-52 border-gray-300 rounded-full bg-white shadow-sm">
                                        <Filter className="w-4 h-4 mr-2 text-blue-600" />
                                        <SelectValue placeholder="Lọc theo trạng thái" />
                                   </SelectTrigger>
                                   <SelectContent>
                                        <SelectItem value="all">Tất cả</SelectItem>
                                        <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                                        <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                        <SelectItem value="PENDING">Đang chờ</SelectItem>
                                   </SelectContent>
                              </Select>
                         </div>
                    </div>

                    {/* Main Content */}
                    <Card className="border border-gray-200 pl-6 rounded-xl shadow-sm">
                         <CardContent className="p-0">
                              <Table>
                                   <TableHeader>
                                        <TableRow className="border-b border-gray-200">
                                             <TableHead className="font-semibold text-black py-4">Thời gian</TableHead>
                                             <TableHead className="font-semibold text-black">Ngày</TableHead>
                                             <TableHead className="font-semibold text-black">Trạng thái</TableHead>
                                             <TableHead className="font-semibold text-black text-center">Thao tác</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {sortedTimeSlots.map((slot) => (
                                             <TableRow
                                                  key={slot.id}
                                                  className={`hover:bg-gray-50 border-b border-gray-100 transition-all duration-200 ${slot.status === "INACTIVE"
                                                       ? "bg-gray-50/70 opacity-75"
                                                       : slot.status === "PENDING"
                                                            ? "bg-amber-50/30"
                                                            : ""
                                                       }`}
                                             >
                                                  <TableCell className="font-medium py-4 text-lg">
                                                       <div className="flex items-center">
                                                            <span className={slot.status === "INACTIVE" ? "text-gray-500 line-through" : "text-black"}>
                                                                 {slot.time}
                                                            </span>
                                                            {slot.status === "INACTIVE" && (
                                                                 <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                                      vô hiệu hóa
                                                                 </span>
                                                            )}
                                                       </div>
                                                  </TableCell>
                                                  <TableCell className={slot.status === "INACTIVE" ? "text-gray-500" : "text-gray-700"}>
                                                       {slot.date}
                                                  </TableCell>
                                                  <TableCell>{getStatusBadge(slot.status)}</TableCell>
                                                  <TableCell className="text-center">
                                                       <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                 <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                                                                      <MoreHorizontal className="h-4 w-4" />
                                                                 </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="border border-gray-300 shadow-md rounded-md p-1">
                                                                 <DropdownMenuItem onClick={() => handleEdit(slot)} className="hover:bg-gray-50 rounded-sm">
                                                                      <Edit className="mr-2 h-4 w-4 text-blue-600" />
                                                                      <span>Sửa</span>
                                                                 </DropdownMenuItem>

                                                                 {slot.status === "ACTIVE" && (
                                                                      <DropdownMenuItem
                                                                           onClick={() => handleDelete(slot.id)}
                                                                           className="text-red-600 hover:bg-red-50 rounded-sm"
                                                                      >
                                                                           <Trash2 className="mr-2 h-4 w-4" />
                                                                           <span>Vô hiệu hóa</span>
                                                                      </DropdownMenuItem>
                                                                 )}

                                                                 {slot.status === "INACTIVE" && (
                                                                      <DropdownMenuItem
                                                                           onClick={() => handleRestoreTimeSlot(slot.id)}
                                                                           className="text-green-600 hover:bg-green-50 rounded-sm"
                                                                      >
                                                                           <RefreshCcw className="mr-2 h-4 w-4" />
                                                                           <span>Kích hoạt lại</span>
                                                                      </DropdownMenuItem>
                                                                 )}
                                                            </DropdownMenuContent>
                                                       </DropdownMenu>
                                                  </TableCell>
                                             </TableRow>
                                        ))}
                                   </TableBody>
                              </Table>
                         </CardContent>
                    </Card>

                    {/* Edit Dialog */}
                    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                         <DialogContent className="sm:max-w-[425px] border border-gray-200 rounded-xl shadow-lg">
                              <DialogHeader>
                                   <DialogTitle className="text-xl font-bold text-black flex items-center">
                                        <Edit className="mr-2 h-5 w-5 text-blue-600" />
                                        Chỉnh sửa lịch trình
                                   </DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                   <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="time" className="text-right font-medium text-gray-700">
                                             Thời gian
                                        </Label>
                                        <Input
                                             id="time"
                                             type="time"
                                             value={editTime}
                                             onChange={(e) => setEditTime(e.target.value)}
                                             className="col-span-3 border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                                        />
                                   </div>
                                   <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="status" className="text-right font-medium text-gray-700">
                                             Trạng thái
                                        </Label>
                                        <div className="col-span-3">
                                             <Select value={editStatus} onValueChange={(value: TimeSlot["status"]) => setEditStatus(value)}>
                                                  <SelectTrigger className="border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500">
                                                       <SelectValue />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                                                       <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                                       <SelectItem value="PENDING">Đang chờ</SelectItem>
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                   </div>
                              </div>
                              <DialogFooter className="gap-2">
                                   <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-300 rounded-md hover:bg-gray-100">
                                        Hủy
                                   </Button>
                                   <Button onClick={handleSaveEdit} className="bg-blue-600 text-white hover:bg-blue-700 rounded-md">
                                        Lưu thay đổi
                                   </Button>
                              </DialogFooter>
                         </DialogContent>
                    </Dialog>
               </div>
          </div >
     )
}
