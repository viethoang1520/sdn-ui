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

const playBeep = () => {
     const audio = new Audio(beepSound)
     audio.play()
}

export default function StationScanner() {
     const [listStation, setListStation] = useState([])
     const [stationSelect, setStationSelect] = useState()
     const [modeStation, setModeStation] = useState('IN')
     const [buttonDisabled, setButtonDisabled] = useState(false)
     const [stationSelectDisabled, setStationSelectDisabled] = useState(false)

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
                              qrbox: { width: 200, height: 170 },
                         },
                         async (decodedText, decodedResult) => {
                              playBeep()
                              html5QrCode.pause()
                              console.log(decodedResult);
                              try {
                                   if (!stationSelect) {
                                        toast.error('Vui lòng chọn trạm')
                                        return
                                   }
                                   if (modeStation === 'IN') {
                                        const { data } = await checkinStation(decodedText, stationSelect);
                                        if (data.errorCode === 'SUCCESS') {
                                             toast.success(data.message)
                                        } else {
                                             toast.error(data.message)
                                        }
                                   } else if (modeStation === 'OUT') {
                                        const { data } = await checkoutStation(decodedText, stationSelect);
                                        if (data.errorCode === 'SUCCESS') {
                                             toast.success(data.message)
                                        } else {
                                             toast.error(data.message)
                                        }
                                   }
                              } catch (e) {
                                   console.log(e)
                                   toast.error('QR không hợp lệ')
                              } finally {
                                   setTimeout(() => {
                                        html5QrCode.resume()
                                   }, 2000)
                              }
                         },
                         // eslint-disable-next-line @typescript-eslint/no-unused-vars
                         (errorMessage) => {
                              // console.log(errorMessage)
                         }
                    )
               }
          })

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
          <div>
               <div className='flex justify-center gap-4 mt-4'>
                    <Select onValueChange={onChangeStation} disabled={stationSelectDisabled}>
                         <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Lựa chọn nhà ga" />
                         </SelectTrigger>
                         <SelectContent>
                              {listStation?.map((station, index) => (
                                   <SelectItem key={station?._id || index} value={station?._id}>{station?.name}</SelectItem>
                              ))}
                         </SelectContent>
                    </Select>

                    <Button
                         onClick={handleToggleMode}
                         className={`${modeStation === 'IN' ? 'bg-green-600' : 'bg-red-500'}`}
                         disabled={buttonDisabled}
                    >
                         {modeStation}
                    </Button>
               </div>
               <div className='text-center mt-6 mb-24'>
                    <h1 className='text-3xl mb-2 font-bold opacity-80'>Quét mã QR vé</h1>
                    <div id="qr-reader" className='m-auto' style={{ width: "400px", height: "300px" }}></div>
               </div>
          </div>
     )
}
