import type { Station } from "@/apis/station"
import React, { useEffect, useState } from "react"

import {
     getListAllStation,
     insertStationBetween,
     insertStationByPosition,
     renameStation,
     updateStationStatus
} from "@/apis/station"
import {
     AlertDialog,
     AlertDialogAction,
     AlertDialogCancel,
     AlertDialogContent,
     AlertDialogDescription,
     AlertDialogFooter,
     AlertDialogHeader,
     AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
     Dialog,
     DialogContent,
     DialogFooter,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table"
import { FileEdit, Lock, Plus, Unlock } from "lucide-react"
import { toast } from "sonner"

export default function StationManagement() {
     const [stations, setStations] = useState<Station[]>([])
     const [loading, setLoading] = useState(true)
     const [formMode, setFormMode] = useState<'create' | 'edit' | 'insert'>('create')
     const [formOpen, setFormOpen] = useState(false)
     const [formData, setFormData] = useState<Partial<Station>>({
          name: '',
          route: 'Metro Line 1',
          prev_station: '',
          next_station: '',
          distance: 0,
          status: 1
     });

     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
     const [stationToDelete, setStationToDelete] = useState<Station | null>(null)

     const [renameDialogOpen, setRenameDialogOpen] = useState(false)
     const [stationToRename, setStationToRename] = useState<Station | null>(null)
     const [newStationName, setNewStationName] = useState('')

     const [insertPosition, setInsertPosition] = useState<'before' | 'after' | 'between'>('after')
     const [prevStation, setPrevStation] = useState<string>('')
     const [nextStation, setNextStation] = useState<string>('')

     useEffect(() => {
          fetchStations()
     }, [])

     useEffect(() => {
          if (formMode === 'create' || formMode === 'insert') {
               if (insertPosition === 'before') {
                    setFormData(prev => ({ ...prev, distance: 0 }));
               } else if (insertPosition === 'after' && stations.length > 0) {
                    const lastStation = stations[stations.length - 1];
                    const newDistance = (lastStation.distance || 0) + 1;
                    setFormData(prev => ({ ...prev, distance: newDistance }));
               } else if (insertPosition === 'between' && prevStation && nextStation && formMode === 'insert') {
                    const prevStationData = stations.find(s => s._id === prevStation);
                    const nextStationData = stations.find(s => s._id === nextStation);

                    if (prevStationData && nextStationData) {
                         const currentDistance = prevStationData.distance || 0;
                         const nextDistance = nextStationData.distance || 0;
                         const minDistance = Math.round((currentDistance + 0.1) * 10) / 10;
                         const maxDistance = Math.round((nextDistance - 0.1) * 10) / 10;
                         const defaultDistance = Math.round(((minDistance + maxDistance) / 2) * 10) / 10;
                         setFormData(prev => ({ ...prev, distance: defaultDistance }));
                    }
               }
          }
     }, [prevStation, nextStation, insertPosition, formMode, stations])

     const fetchStations = async () => {
          try {
               setLoading(true);
               const data = await getListAllStation();
               console.log(data);
               setStations(data.stations);
          } catch (err) {
               alert("Không thể tải danh sách ga. Vui lòng thử lại sau.");
               console.error(err);
          } finally {
               setLoading(false);
          }
     };

     // Hàm xử lý khi submit form
     const handleFormSubmit = async (e: React.FormEvent) => {
          e.preventDefault()
          console.log('Form mode:', formMode, 'Insert position:', insertPosition);

          try {
               if (formMode === 'insert') {
                    const res = await insertStationBetween(
                         formData.name,
                         formData.distance,
                         insertPosition, // Truyền position: 'start', 'end', hoặc 'between'
                         formData.prev_station,
                         formData.next_station
                    )
                    toast.success(res.message)
               }
               if (formMode === 'create') {
                    let stationName = '';
                    if (insertPosition === 'before' && stations.length > 0) {
                         stationName = stations[0].name; // Ga đầu tiên
                    } else if (insertPosition === 'after' && stations.length > 0) {
                         stationName = stations[stations.length - 1].name; // Ga cuối cùng
                    }

                    const res = await insertStationByPosition(formData.name, formData.distance, insertPosition, stationName)
                    console.log(res);
               }
               setFormOpen(false);
               fetchStations();
          } catch (err) {
               console.error(err);
          }
     };

     // Hàm xử lý xóa station
     const handleDeleteStation = async () => {
          try {
               if (stationToDelete?._id) {
                    setDeleteDialogOpen(false);
                    setStationToDelete(null);
                    alert("Đã xóa ga thành công.");
                    fetchStations();
               }
          } catch (err) {
               alert("Không thể xóa ga. Vui lòng thử lại sau.");
               console.error(err);
          }
     };

     // Hàm xử lý khóa/mở khóa station
     const handleToggleStationStatus = async (station: Station) => {
          try {
               const newStatus = station.status === 1 ? 0 : 1; // Toggle: 1->0 hoặc 0->1
               await updateStationStatus(station._id, newStatus);
               toast.success(`Đã ${newStatus === 1 ? 'mở khóa' : 'khóa'} ga "${station.name}" thành công!`);
               fetchStations(); // Refresh danh sách
          } catch (err) {
               console.error(err);
               toast.error("Không thể cập nhật trạng thái ga. Vui lòng thử lại sau.");
          }
     };

     // Hàm xử lý đổi tên station
     const handleRenameStation = async () => {
          try {
               if (stationToRename && newStationName.trim()) {
                    await renameStation(stationToRename._id, newStationName.trim());
                    toast.success(`Đã đổi tên ga thành "${newStationName}" thành công!`);
                    setRenameDialogOpen(false);
                    setStationToRename(null);
                    setNewStationName('');
                    fetchStations(); // Refresh danh sách
               }
          } catch (err) {
               console.error(err);
               toast.error("Không thể đổi tên ga. Vui lòng thử lại sau.");
          }
     };

     // Hàm để mở dialog đổi tên
     const openRenameDialog = (station: Station) => {
          setStationToRename(station);
          setNewStationName(station.name);
          setRenameDialogOpen(true);
     };

     const openCreateForm = () => {
          setFormMode('create');
          const defaultDistance = stations.length > 0 ? (stations[stations.length - 1].distance || 0) + 1 : 1;
          setFormData({
               name: '',
               route: 'Metro Line 1',
               prev_station: '',
               next_station: '',
               distance: defaultDistance,
               status: 1
          });
          setPrevStation('');
          setNextStation('');
          setInsertPosition('after'); // Mặc định chọn cuối tuyến
          setFormOpen(true);
     };

     // Hàm để mở form chèn giữa hai ga cụ thể
     const openInsertBetweenForm = (currentStation: Station, nextStation: Station) => {
          setFormMode('insert');
          setFormData({
               name: '',
               route: 'Metro Line 1',
               prev_station: currentStation.name,
               next_station: nextStation.name,
               distance: (nextStation.distance + currentStation.distance) / 2,
               status: 1
          });
          setInsertPosition('between'); // Mặc định và bắt buộc chọn giữa
          setPrevStation(currentStation._id);
          setNextStation(nextStation._id);
          setFormOpen(true);
     }

     return (
          <div className="p-6">
               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Quản lý ga tàu</h1>
                    <div className="flex gap-2">
                         <Button onClick={openCreateForm}>
                              <Plus className="w-4 h-4 mr-2" />
                              Thêm ga mới
                         </Button>
                    </div>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>Danh sách ga tàu Metro</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {loading ? (
                              <div className="flex justify-center items-center h-40">
                                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                              </div>
                         ) : (
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>Tên ga</TableHead>
                                             <TableHead>Tuyến</TableHead>
                                             <TableHead>Ga trước</TableHead>
                                             <TableHead>Ga sau</TableHead>
                                             <TableHead>Khoảng cách đến ga tiếp theo</TableHead>
                                             <TableHead>Trạng thái</TableHead>
                                             <TableHead className="text-right">Thao tác</TableHead>
                                        </TableRow>
                                   </TableHeader>
                                   <TableBody>
                                        {stations?.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                                                       Không có ga nào. Hãy thêm ga mới.
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             <>
                                                  {stations?.map((station, index) => (
                                                       <React.Fragment key={station._id}>
                                                            <TableRow>
                                                                 <TableCell className="font-medium">{station.name}</TableCell>
                                                                 <TableCell>{station.route}</TableCell>
                                                                 <TableCell>{station.prev_station || "—"}</TableCell>
                                                                 <TableCell>{station.next_station || "—"}</TableCell>
                                                                 <TableCell>{station.distance ? `${station.distance} km` : "—"}</TableCell>
                                                                 <TableCell>
                                                                      <Badge variant={station.status === 1 ? "default" : "outline"}>
                                                                           {station.status === 1 ? "Hoạt động" : "Không hoạt động"}
                                                                      </Badge>
                                                                 </TableCell>
                                                                 <TableCell className="text-right">
                                                                      <div className="flex justify-end gap-2">
                                                                           <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => openRenameDialog(station)}>
                                                                                <FileEdit className="h-4 w-4" />
                                                                           </Button>
                                                                           <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className={station.status === 1 ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"}
                                                                                onClick={() => handleToggleStationStatus(station)}
                                                                           >
                                                                                {station.status === 1 ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                                                                           </Button>
                                                                      </div>
                                                                 </TableCell>
                                                            </TableRow>

                                                            {/* Hiển thị nút chèn ga sau mỗi ga (trừ ga cuối) */}
                                                            {index < stations.length - 1 && (
                                                                 <TableRow className="bg-gray-50/50 h-8 hover:bg-gray-100">
                                                                      <TableCell colSpan={7}>
                                                                           <Button
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                className="w-full flex items-center justify-center text-muted-foreground text-xs py-0 h-6"
                                                                                onClick={() => openInsertBetweenForm(station, stations[index + 1])}
                                                                           >
                                                                                <Plus className="h-3 w-3 mr-1" />
                                                                                Chèn ga mới giữa "{station.name}" và "{stations[index + 1].name}"
                                                                           </Button>
                                                                      </TableCell>
                                                                 </TableRow>
                                                            )}
                                                       </React.Fragment>
                                                  ))}
                                             </>
                                        )}
                                   </TableBody>
                              </Table>
                         )}
                    </CardContent>
               </Card>

               {/* Form Dialog */}
               <Dialog open={formOpen} onOpenChange={setFormOpen}>
                    <DialogContent className="sm:max-w-[550px]">
                         <DialogHeader>
                              <DialogTitle>
                                   {formMode === 'edit' && "Sửa thông tin ga"}
                                   {formMode === 'create' && "Thêm ga mới"}
                                   {formMode === 'insert' && "Chèn ga mới"}
                              </DialogTitle>
                         </DialogHeader>
                         <form onSubmit={handleFormSubmit} className="space-y-4 py-2">
                              <div className="space-y-2">
                                   <Label htmlFor="name">Tên ga <span className="text-red-500">*</span></Label>
                                   <Input
                                        id="name"
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nhập tên ga"
                                        required
                                   />
                              </div>

                              <div className="space-y-2">
                                   <Label htmlFor="route">Tuyến <span className="text-red-500">*</span></Label>
                                   <Input
                                        id="route"
                                        value={formData.route || 'Metro Line 1'}
                                        onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                                        placeholder="Nhập tên tuyến"
                                        required
                                        disabled
                                   />
                              </div>

                              {(formMode === 'insert' || formMode === 'create') && (
                                   <div>
                                        <Separator className="my-4" />
                                        <div className="space-y-4">
                                             <Label>Vị trí chèn</Label>
                                             <RadioGroup
                                                  defaultValue="after"
                                                  value={insertPosition}
                                                  onValueChange={(value) => setInsertPosition(value as 'before' | 'after' | 'between')}
                                                  disabled={formMode === 'insert'} // Disable khi mode insert
                                             >
                                                  <div className="flex items-center space-x-2">
                                                       <RadioGroupItem value="before" id="before" />
                                                       <Label htmlFor="before">Chèn vào đầu tuyến</Label>
                                                  </div>
                                                  <div className="flex items-center space-x-2">
                                                       <RadioGroupItem value="after" id="after" />
                                                       <Label htmlFor="after">Chèn vào cuối tuyến</Label>
                                                  </div>
                                                  {formMode === 'insert' && ( // Chỉ hiện option "giữa" khi mode insert
                                                       <div className="flex items-center space-x-2">
                                                            <RadioGroupItem value="between" id="between" />
                                                            <Label htmlFor="between">Chèn vào giữa</Label>
                                                       </div>
                                                  )}
                                             </RadioGroup>

                                             {insertPosition === 'between' && (
                                                  <div>
                                                       <p className="text-sm text-gray-500 mb-2 mt-4">
                                                            Chọn hai ga liền kề để chèn ga mới vào giữa. Nếu chọn hai ga không liền kề, ga mới sẽ được thêm vào hệ thống nhưng có thể không hiển thị đúng trong chuỗi ga.
                                                       </p>
                                                       <div className="grid grid-cols-2 gap-4 mt-4">
                                                            <div className="space-y-2">
                                                                 <Label htmlFor="prevStation">Ga trước</Label>
                                                                 <Select
                                                                      value={prevStation}
                                                                      onValueChange={(value) => {
                                                                           setPrevStation(value);
                                                                      }}
                                                                      required
                                                                 >
                                                                      <SelectTrigger className={!prevStation ? "border-red-300" : ""}>
                                                                           <SelectValue placeholder="Chọn ga trước" />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                           {stations.map((station) => (
                                                                                <SelectItem key={station._id} value={station._id}>
                                                                                     {station.name}
                                                                                </SelectItem>
                                                                           ))}
                                                                      </SelectContent>
                                                                 </Select>
                                                                 {!prevStation && (
                                                                      <p className="text-sm text-red-500 mt-1">Vui lòng chọn ga trước</p>
                                                                 )}
                                                            </div>
                                                            <div className="space-y-2">
                                                                 <Label htmlFor="nextStation">Ga sau</Label>
                                                                 <Select
                                                                      value={nextStation}
                                                                      onValueChange={(value) => {
                                                                           setNextStation(value);
                                                                      }}
                                                                      required
                                                                 >
                                                                      <SelectTrigger className={!nextStation ? "border-red-300" : ""}>
                                                                           <SelectValue placeholder="Chọn ga sau" />
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                           {stations.map((station) => (
                                                                                <SelectItem
                                                                                     key={station._id}
                                                                                     value={station._id}
                                                                                     disabled={station._id === prevStation}
                                                                                >
                                                                                     {station.name}
                                                                                     {station._id === prevStation ? " (đã chọn làm ga trước)" : ""}
                                                                                </SelectItem>
                                                                           ))}
                                                                      </SelectContent>
                                                                 </Select>
                                                                 {!nextStation && (
                                                                      <p className="text-sm text-red-500 mt-1">Vui lòng chọn ga sau</p>
                                                                 )}
                                                                 {prevStation && nextStation && prevStation === nextStation && (
                                                                      <p className="text-sm text-red-500 mt-1">Ga trước và ga sau không được trùng nhau</p>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </div>
                                             )}

                                             <div className="space-y-2 mt-4">
                                                  <Label htmlFor="distance">
                                                       Khoảng cách đến ga tiếp theo <span className="text-xs text-muted-foreground">(km)</span>
                                                  </Label>
                                                  <Input
                                                       id="distance"
                                                       type="number"
                                                       step="0.1"
                                                       value={formData.distance !== undefined ? formData.distance : 0}
                                                       onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
                                                       placeholder="Nhập khoảng cách"
                                                       required
                                                  />
                                                  <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded border">
                                                       ⚠️ Lưu ý: Khoảng cách sẽ được kiểm tra tính hợp lệ khi lưu. Vui lòng đảm bảo giá trị phù hợp với vị trí chèn.
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              )}

                              {(formMode !== 'insert' && formMode !== 'create') && (
                                   <>
                                        <div className="grid grid-cols-2 gap-4">
                                             <div className="space-y-2">
                                                  <Label htmlFor="prev_station">Ga trước</Label>
                                                  <Input
                                                       id="prev_station"
                                                       value={formData.prev_station || ''}
                                                       onChange={(e) => setFormData({ ...formData, prev_station: e.target.value })}
                                                       placeholder="Nhập tên ga trước"
                                                  />
                                             </div>
                                             <div className="space-y-2">
                                                  <Label htmlFor="next_station">Ga sau</Label>
                                                  <Input
                                                       id="next_station"
                                                       value={formData.next_station || ''}
                                                       onChange={(e) => setFormData({ ...formData, next_station: e.target.value })}
                                                       placeholder="Nhập tên ga sau"
                                                  />
                                             </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                             <div className="space-y-2">
                                                  <Label htmlFor="distance">
                                                       Khoảng cách đến ga tiếp theo <span className="text-xs text-muted-foreground">(0-10 km)</span>
                                                  </Label>
                                                  <Input
                                                       id="distance"
                                                       type="number"
                                                       min="0"
                                                       max="10"
                                                       step="0.1"
                                                       value={formData.distance || 0}
                                                       onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
                                                  />
                                                  <p className="text-xs text-muted-foreground">
                                                       Khoảng cách từ ga này đến ga tiếp theo (km)
                                                  </p>
                                             </div>
                                             <div className="space-y-2">
                                                  <Label htmlFor="status">Trạng thái</Label>
                                                  <Select
                                                       value={String(formData.status)}
                                                       onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) })}
                                                  >
                                                       <SelectTrigger>
                                                            <SelectValue placeholder="Chọn trạng thái" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            <SelectItem value="1">Hoạt động</SelectItem>
                                                            <SelectItem value="0">Không hoạt động</SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </div>
                                        </div>
                                   </>
                              )}

                              <DialogFooter>
                                   <Button type="submit">
                                        {formMode === 'edit' ? 'Cập nhật' :
                                             formMode === 'create' ? 'Thêm ga' :
                                                  'Chèn ga'}
                                   </Button>
                              </DialogFooter>
                         </form>
                    </DialogContent>
               </Dialog>

               {/* Rename Station Dialog */}
               <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
                    <DialogContent className="sm:max-w-[400px]">
                         <DialogHeader>
                              <DialogTitle>Đổi tên ga</DialogTitle>
                         </DialogHeader>
                         <div className="space-y-4 py-2">
                              <div className="space-y-2">
                                   <Label htmlFor="newName">Tên ga mới <span className="text-red-500">*</span></Label>
                                   <Input
                                        id="newName"
                                        value={newStationName}
                                        onChange={(e) => setNewStationName(e.target.value)}
                                        placeholder="Nhập tên ga mới"
                                        onKeyDown={(e) => {
                                             if (e.key === 'Enter') {
                                                  handleRenameStation();
                                             }
                                        }}
                                   />
                              </div>
                              <p className="text-sm text-muted-foreground">
                                   Đang đổi tên ga: <span className="font-semibold">"{stationToRename?.name}"</span>
                              </p>
                         </div>
                         <DialogFooter>
                              <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                                   Hủy
                              </Button>
                              <Button
                                   onClick={handleRenameStation}
                                   disabled={!newStationName.trim() || newStationName.trim() === stationToRename?.name}
                              >
                                   Đổi tên
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>

               {/* Delete Confirmation Dialog */}
               <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                              <AlertDialogDescription>
                                   Hành động này không thể hoàn tác. Ga "{stationToDelete?.name}" sẽ bị xóa vĩnh viễn.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDeleteStation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                   Xóa
                              </AlertDialogAction>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>
          </div>
     );
}
