import { getListStation } from '@/apis/station'
import { checkinStation, checkoutStation } from '@/apis/ticket'
import { Button } from '@/components/ui/button'
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select"
import { Html5Qrcode } from 'html5-qrcode'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import beepSound from '../../public/beep-313342.mp3'
import invalidSound from '../../public/invalid-selection-39351.mp3'
import { QrCode, MapPin, LogIn, LogOut } from 'lucide-react'

const playBeep = () => {
     const audio = new Audio(beepSound)
     audio.play()
}

const playInvalidSound = () => {
     const audio = new Audio(invalidSound)
     audio.play()
}

export default function StationScanner() {
     const [listStation, setListStation] = useState([])
     const [stationSelect, setStationSelect] = useState()
     const [modeStation, setModeStation] = useState('IN')
     const [buttonDisabled, setButtonDisabled] = useState(false)
     const [stationSelectDisabled, setStationSelectDisabled] = useState(false)
     const [isCameraActive, setIsCameraActive] = useState(true)
     const [lastScanResult, setLastScanResult] = useState({
          text: '',
          success: false,
          timestamp: null
     })

     useEffect(() => {
          const fetchData = async () => {
               const { data } = await getListStation()
               if (data) setListStation(data)
          }
          fetchData()
     }, [])

     useEffect(() => {
          const qrRegionId = "qr-reader"
          const html5QrCode = new Html5Qrcode(qrRegionId)

          Html5Qrcode.getCameras().then((devices) => {
               if (devices && devices.length) {
                    const cameraId = devices[0].id

                    html5QrCode.start(
                         cameraId,
                         {
                              fps: 10,
                              qrbox: { width: 200, height: 200 },
                         },
                         async (decodedText, decodedResult) => {
                              // Tạm dừng camera và cập nhật trạng thái
                              html5QrCode.pause()
                              setIsCameraActive(false)
                              console.log(decodedResult);

                              try {
                                   if (!stationSelect) {
                                        playInvalidSound() // Phát âm thanh lỗi
                                        toast.error('Vui lòng chọn trạm', {
                                             position: 'top-center',
                                             duration: 3000,
                                        })
                                        setLastScanResult({
                                             text: 'Chưa chọn nhà ga',
                                             success: false,
                                             timestamp: new Date()
                                        })
                                        return
                                   }

                                   if (modeStation === 'IN') {
                                        const { data } = await checkinStation(decodedText, stationSelect);
                                        if (data.errorCode === 'SUCCESS') {
                                             playBeep() // Phát âm thanh thành công
                                             toast.success(data.message, {
                                                  position: 'top-center',
                                                  duration: 3000,
                                             })
                                             setLastScanResult({
                                                  text: decodedText,
                                                  success: true,
                                                  timestamp: new Date()
                                             })
                                        } else {
                                             playInvalidSound() // Phát âm thanh lỗi
                                             toast.error(data.message, {
                                                  position: 'top-center',
                                                  duration: 3000,
                                             })
                                             setLastScanResult({
                                                  text: decodedText,
                                                  success: false,
                                                  timestamp: new Date()
                                             })
                                        }
                                   } else if (modeStation === 'OUT') {
                                        const { data } = await checkoutStation(decodedText, stationSelect);
                                        if (data.errorCode === 'SUCCESS') {
                                             playBeep() // Phát âm thanh thành công
                                             toast.success(data.message, {
                                                  position: 'top-center',
                                                  duration: 3000,
                                             })
                                             setLastScanResult({
                                                  text: decodedText,
                                                  success: true,
                                                  timestamp: new Date()
                                             })
                                        } else {
                                             playInvalidSound() // Phát âm thanh lỗi
                                             toast.error(data.message, {
                                                  position: 'top-center',
                                                  duration: 3000,
                                             })
                                             setLastScanResult({
                                                  text: decodedText,
                                                  success: false,
                                                  timestamp: new Date()
                                             })
                                        }
                                   }
                              } catch (e) {
                                   console.error(e)
                                   playInvalidSound() // Phát âm thanh lỗi
                                   toast.error('QR không hợp lệ', {
                                        position: 'top-center',
                                        duration: 3000,
                                   })
                                   setLastScanResult({
                                        text: 'Mã QR không hợp lệ',
                                        success: false,
                                        timestamp: new Date()
                                   })
                              } finally {
                                   // Đảm bảo camera được kích hoạt lại sau khi xử lý
                                   setTimeout(() => {
                                        html5QrCode.resume()
                                        setIsCameraActive(true)
                                   }, 2000)
                              }
                         },
                         // eslint-disable-next-line @typescript-eslint/no-unused-vars
                         (errorMessage) => {
                              // console.log(errorMessage)
                         }
                    ).catch(err => {
                         console.error("Không thể khởi tạo camera: ", err);
                         setIsCameraActive(false);
                         toast.error('Không thể kết nối với camera. Vui lòng kiểm tra quyền truy cập camera.', {
                              position: 'top-center',
                              duration: 5000
                         });
                    });
               } else {
                    setIsCameraActive(false);
                    toast.error('Không tìm thấy camera nào trên thiết bị này.', {
                         position: 'top-center',
                         duration: 5000
                    });
               }
          }).catch(err => {
               console.error("Lỗi khi tìm kiếm camera: ", err);
               setIsCameraActive(false);
               toast.error('Không thể tìm kiếm camera trên thiết bị này.', {
                    position: 'top-center',
                    duration: 5000
               });
          });

          return () => {
               html5QrCode.stop().catch((err) => console.log("Stop error", err))
          }
     }, [stationSelect, modeStation])

     const onChangeStation = (value) => {
          setStationSelectDisabled(true)
          setStationSelect(value)
          setTimeout(() => setStationSelectDisabled(false), 2000)
     }

     const handleToggleMode = () => {
          setButtonDisabled(true)
          setModeStation(modeStation === 'IN' ? 'OUT' : 'IN')
          setTimeout(() => setButtonDisabled(false), 2000)
     }

     return (
          <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
               <div className="container mx-auto px-4 py-8">
                    <div className="text-center mb-8">
                         <h1 className="text-4xl font-bold text-blue-800 mb-2">Metro Station Scanner</h1>
                         <p className="text-lg text-blue-600">Hệ thống quét vé điện tử Metro</p>
                    </div>

                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                         <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                              <div className='flex justify-between items-center'>
                                   <div>
                                        <h2 className="text-2xl font-bold">Trạm kiểm soát vé</h2>
                                        <p className="opacity-90">Quét mã QR để vào/ra ga</p>
                                   </div>
                                   <div className="text-right">
                                        <div className="text-sm opacity-80">Chế độ hiện tại</div>
                                        <div className={`text-xl font-bold ${modeStation === 'IN' ? 'text-green-300' : 'text-red-300'}`}>
                                             {modeStation === 'IN' ? 'CHECK IN' : 'CHECK OUT'}
                                        </div>
                                   </div>
                              </div>
                         </div>

                         <div className='flex flex-col md:flex-row p-6 gap-6'>
                              <div className='md:w-1/3 space-y-6'>
                                   <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <h3 className="font-semibold text-gray-700 mb-3">Cài đặt trạm</h3>

                                        <div className="space-y-4">
                                             <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                                       <MapPin className="inline-block mr-1 h-4 w-4" /> Chọn nhà ga
                                                  </label>
                                                  <Select onValueChange={onChangeStation} disabled={stationSelectDisabled}>
                                                       <SelectTrigger className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                                                            <SelectValue placeholder="Lựa chọn nhà ga" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            {listStation?.map((station, index) => (
                                                                 <SelectItem key={station?._id || index} value={station?._id}>{station?.name}</SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             </div>

                                             <div>
                                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                                       {modeStation === 'IN'
                                                            ? <><LogIn className="inline-block mr-1 h-4 w-4" /> Chế độ kiểm soát</>
                                                            : <><LogOut className="inline-block mr-1 h-4 w-4" /> Chế độ kiểm soát</>
                                                       }
                                                  </label>
                                                  <Button
                                                       onClick={handleToggleMode}
                                                       className={`w-full ${modeStation === 'IN'
                                                            ? 'bg-green-600 hover:bg-green-700'
                                                            : 'bg-red-600 hover:bg-red-700'}`}
                                                       disabled={buttonDisabled}
                                                  >
                                                       {modeStation === 'IN' ? 'CHECK IN' : 'CHECK OUT'}
                                                  </Button>
                                             </div>
                                        </div>
                                   </div>

                                   {lastScanResult.timestamp && (
                                        <div className={`p-4 rounded-lg border ${lastScanResult.success ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                                             <h3 className={`font-semibold mb-2 ${lastScanResult.success ? 'text-green-800' : 'text-red-800'}`}>
                                                  <QrCode className="inline-block mr-2 h-5 w-5" />
                                                  Kết quả quét gần nhất
                                             </h3>
                                             <div className={`text-sm ${lastScanResult.success ? 'text-green-700' : 'text-red-700'}`}>
                                                  <p className="mb-1"><strong>Mã:</strong> {lastScanResult.text}</p>
                                                  <p className="mb-1"><strong>Trạng thái:</strong> {lastScanResult.success ? 'Thành công' : 'Thất bại'}</p>
                                                  <p><strong>Thời gian:</strong> {lastScanResult.timestamp.toLocaleTimeString()}</p>
                                             </div>
                                        </div>
                                   )}

                                   <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h3 className="font-semibold text-blue-800 mb-2">
                                             <QrCode className="inline-block mr-2 h-5 w-5" />
                                             Hướng dẫn sử dụng
                                        </h3>
                                        <ul className="text-sm text-blue-700 space-y-2">
                                             <li className="flex items-start">
                                                  <span className="mr-2">1.</span>
                                                  <span>Chọn nhà ga hiện tại từ danh sách</span>
                                             </li>
                                             <li className="flex items-start">
                                                  <span className="mr-2">2.</span>
                                                  <span>Chọn chế độ CHECK IN (vào ga) hoặc CHECK OUT (ra ga)</span>
                                             </li>
                                             <li className="flex items-start">
                                                  <span className="mr-2">3.</span>
                                                  <span>Đưa mã QR của vé vào vùng quét</span>
                                             </li>
                                             <li className="flex items-start">
                                                  <span className="mr-2">4.</span>
                                                  <span>Hệ thống sẽ tự động xác thực và phát âm báo hiệu</span>
                                             </li>
                                        </ul>
                                   </div>
                              </div>

                              <div className='md:w-2/3'>
                                   <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                             <h3 className="font-semibold text-gray-700">
                                                  <QrCode className="inline-block mr-2 h-5 w-5" />
                                                  Vùng quét mã QR
                                             </h3>
                                             <div className={`${isCameraActive ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'} text-xs px-2 py-1 rounded-full flex items-center`}>
                                                  {isCameraActive ? (
                                                       <>
                                                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></span>
                                                            Camera đang hoạt động
                                                       </>
                                                  ) : (
                                                       <>
                                                            <span className="inline-block w-2 h-2 bg-gray-500 rounded-full mr-1"></span>
                                                            Camera tạm dừng
                                                       </>
                                                  )}
                                             </div>
                                        </div>
                                        <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-3">
                                             <div id="qr-reader" className="m-auto overflow-hidden rounded-lg" style={{ width: "100%", height: "350px" }}></div>
                                        </div>
                                        <div className="mt-4 text-center text-sm text-gray-500">
                                             Đặt mã QR vào trung tâm vùng quét để xử lý nhanh nhất
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     )
}
