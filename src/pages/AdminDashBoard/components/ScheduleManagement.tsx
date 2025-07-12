import { getListTimetable } from "@/apis/admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit, Filter, MoreHorizontal, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

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
          // data.data.data là mảng như ảnh, cần map lại cho đúng TimeSlot
          const mapped = (data.data.data || []).map((item: any) => ({
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
                    return <Badge className="bg-black text-white">Đang hoạt động</Badge>
               case "INACTIVE":
                    return <Badge className="bg-red-500 text-white">Không hoạt động</Badge>
               case "PENDING":
                    return (
                         <Badge variant="outline" className="border-black text-black">
                              Đang chờ
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

     const handleSaveEdit = () => {
          if (!editingSlot) return

          if (!validateTimeEdit(editTime, editingSlot.id)) {
               // toast({
               //      title: "Lỗi",
               //      description: "Thời gian không được vượt quá giờ trước hoặc giờ sau",
               //      variant: "destructive",
               // })
               return
          }

          const updatedSlots = timeSlots.map((slot) =>
               slot.id === editingSlot.id
                    ? { ...slot, time: editTime, title: editTitle, type: editType, status: editStatus }
                    : slot,
          )

          setTimeSlots(updatedSlots)
          setIsEditDialogOpen(false)
          setEditingSlot(null)

          handleUpdateTimeSlot(editingSlot.id, {
               time: editTime,
               title: editTitle,
               type: editType,
               status: editStatus,
          })

          // toast({
          //      title: "Thành công",
          //      description: "Đã cập nhật lịch trình",
          // })
     }

     const handleDelete = (id: string) => {
          setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
          handleDeleteTimeSlot(id)

          // toast({
          //      title: "Thành công",
          //      description: "Đã xóa lịch trình",
          // })
     }

     const handleDeleteTimeSlot = (id: string) => {
          console.log("Delete time slot with ID:", id)
     }

     const handleUpdateTimeSlot = (
          id: string,
          newData: { time: string; title: string; type: TimeSlot["type"]; status: TimeSlot["status"] },
     ) => {
          console.log("Update time slot with ID:", id, "New data:", newData)
     }

     const filteredTimeSlots =
          filterStatus === "all" ? timeSlots : timeSlots.filter((slot) => slot.status === filterStatus)

     const sortedTimeSlots = filteredTimeSlots

     return (
          <div className="min-h-screen bg-white">
               <div className="mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                         <div>
                              <h1 className="text-2xl font-bold text-black">Quản lý lịch trình</h1>
                              <p className="text-gray-600 mt-1">Quản lý và điều chỉnh lịch trình hàng ngày</p>
                         </div>
                         <div className="flex items-center gap-4">
                              <Select value={filterStatus} onValueChange={setFilterStatus}>
                                   <SelectTrigger className="w-48 border-gray-300">
                                        <Filter className="w-4 h-4 mr-2" />
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
                    <Card className="border border-gray-300 pl-6">
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
                                             <TableRow key={slot.id} className="hover:bg-gray-50 border-b border-gray-100">
                                                  <TableCell className="font-medium text-black py-4 text-lg">{slot.time}</TableCell>
                                                  <TableCell className="text-gray-700">{slot.date}</TableCell>
                                                  <TableCell>{getStatusBadge(slot.status)}</TableCell>
                                                  <TableCell className="text-center">
                                                       <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                 <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
                                                                      <MoreHorizontal className="h-4 w-4" />
                                                                 </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="border border-gray-300">
                                                                 <DropdownMenuItem onClick={() => handleEdit(slot)} className="hover:bg-gray-50">
                                                                      <Edit className="mr-2 h-4 w-4" />
                                                                      Sửa
                                                                 </DropdownMenuItem>
                                                                 <DropdownMenuItem
                                                                      onClick={() => handleDelete(slot.id)}
                                                                      className="text-red-600 hover:bg-red-50"
                                                                 >
                                                                      <Trash2 className="mr-2 h-4 w-4" />
                                                                      Xóa
                                                                 </DropdownMenuItem>
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
                         <DialogContent className="sm:max-w-[425px] border border-gray-300">
                              <DialogHeader>
                                   <DialogTitle className="text-xl font-bold text-black">Chỉnh sửa lịch trình</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                   <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="time" className="text-right font-medium text-black">
                                             Thời gian
                                        </Label>
                                        <Input
                                             id="time"
                                             type="time"
                                             value={editTime}
                                             onChange={(e) => setEditTime(e.target.value)}
                                             className="col-span-3 border-gray-300"
                                        />
                                   </div>
                                   <Label htmlFor="status" className="text-right font-medium text-black">
                                        Trạng thái
                                   </Label>
                                   <Select value={editStatus} onValueChange={(value: TimeSlot["status"]) => setEditStatus(value)}>
                                        <SelectTrigger className="col-span-3 border-gray-300">
                                             <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
                                             <SelectItem value="INACTIVE">Không hoạt động</SelectItem>
                                             <SelectItem value="PENDING">Đang chờ</SelectItem>
                                        </SelectContent>
                                   </Select>
                              </div>
                         <DialogFooter>
                              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="border-gray-300">
                                   Hủy
                              </Button>
                              <Button onClick={handleSaveEdit} className="bg-black text-white hover:bg-gray-800">
                                   Lưu thay đổi
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
          </div >
     )
}
