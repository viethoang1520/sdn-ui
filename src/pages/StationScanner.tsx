import React, { useEffect } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { checkinStation } from '@/apis/ticket'
import { toast } from 'sonner'
import beepSound from '../../public/beep-313342.mp3'

const playBeep = () => {
     const audio = new Audio(beepSound)
     audio.play()
}

export default function StationScanner() {
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
                              const { data } = await checkinStation(decodedText)
                              if (data.errorCode === 'SUCCESS') {
                                   toast.success(data.message)
                              } else {
                                   toast.error('Error')
                              }
                              setTimeout(() => {
                                   html5QrCode.resume()
                              }, 3000)
                         },
                         (errorMessage) => {
                              console.log(`Scan error: ${errorMessage}`)
                         }
                    )
               }
          })

          return () => {
               html5QrCode.stop().catch((err) => console.log("Stop error", err))
          }
     }, [])

     return (
          <div>
               <div className='text-center'>
                    <h2>Scan QR Code</h2>
                    <div id="qr-reader" className='m-auto' style={{ width: "400px", height: "300px" }}></div>
               </div>
          </div>
     )
}
