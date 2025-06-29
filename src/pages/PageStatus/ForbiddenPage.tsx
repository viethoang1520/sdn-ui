import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Shield, Lock, User, Phone } from "lucide-react"
import { Link } from "react-router-dom"

export default function ForbiddenPage() {
     return (
          <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-8 flex items-center justify-center">
               <div className="max-w-2xl mx-auto px-4 w-full">
                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                         <CardContent className="p-12 text-center">
                              {/* Error Code */}
                              <div className="mb-8">
                                   <h1 className="text-9xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                                        403
                                   </h1>
                                   <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mt-4 rounded-full"></div>
                              </div>

                              {/* Error Message */}
                              <div className="mb-8 space-y-4">
                                   <h2 className="text-3xl font-bold text-gray-800 tracking-wide">Truy Cập Bị Từ Chối</h2>
                                   <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                                        Xin lỗi, bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra quyền hạn của bạn.
                                   </p>
                              </div>

                              {/* Illustration */}
                              <div className="mb-8">
                                   <div className="w-32 h-32 mx-auto bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                                        <Shield className="w-16 h-16 text-red-400" />
                                   </div>
                              </div>

                              {/* Reasons */}
                              <div className="mb-8">
                                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Có thể do các lý do sau:</h3>
                                   <div className="grid grid-cols-1 gap-4 text-left">
                                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                                             <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                  <Lock className="w-4 h-4 text-white" />
                                             </div>
                                             <div>
                                                  <h4 className="font-medium text-gray-800">Không có quyền truy cập</h4>
                                                  <p className="text-sm text-gray-600">Tài khoản của bạn không có quyền xem nội dung này</p>
                                             </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg">
                                             <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                  <User className="w-4 h-4 text-white" />
                                             </div>
                                             <div>
                                                  <h4 className="font-medium text-gray-800">Cần đăng nhập</h4>
                                                  <p className="text-sm text-gray-600">Bạn cần đăng nhập để truy cập trang này</p>
                                             </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
                                             <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                  <Phone className="w-4 h-4 text-white" />
                                             </div>
                                             <div>
                                                  <h4 className="font-medium text-gray-800">Tài khoản bị hạn chế</h4>
                                                  <p className="text-sm text-gray-600">Tài khoản của bạn có thể đã bị tạm khóa hoặc hạn chế</p>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                   <Link to="/">
                                        <Button className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
                                             <Home className="w-4 h-4 mr-2" />
                                             Về Trang Chủ
                                        </Button>
                                   </Link>
                                   <Button
                                        variant="outline"
                                        onClick={() => window.history.back()}
                                        className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
                                   >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Quay Lại
                                   </Button>
                              </div>

                              {/* Contact Support */}
                              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                                   <h3 className="text-lg font-semibold text-gray-800 mb-2">Cần Hỗ Trợ?</h3>
                                   <p className="text-gray-600 mb-4">
                                        Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi.
                                   </p>
                                   <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a
                                             href="mailto:support@metro.vn"
                                             className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                             Email Hỗ Trợ
                                        </a>
                                        <a
                                             href="tel:1900-1234"
                                             className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                             <Phone className="w-4 h-4 mr-2" />
                                             1900-1234
                                        </a>
                                   </div>
                              </div>

                              {/* Additional Info */}
                              <div className="mt-8 pt-6 border-t border-gray-200">
                                   <p className="text-sm text-gray-500">
                                        Mã lỗi: 403 | Thời gian: {new Date().toLocaleString("vi-VN")} |{" "}
                                        <a href="mailto:support@metro.vn" className="text-red-600 hover:underline">
                                             Báo cáo sự cố
                                        </a>
                                   </p>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     )
}
