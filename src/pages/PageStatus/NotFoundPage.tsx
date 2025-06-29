import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function NotFoundPage() {
     return (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 flex items-center justify-center">
               <div className="max-w-2xl mx-auto px-4 w-full">
                    <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
                         <CardContent className="p-12 text-center">
                              {/* Error Code */}
                              <div className="mb-8">
                                   <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        404
                                   </h1>
                                   <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mt-4 rounded-full"></div>
                              </div>

                              {/* Error Message */}
                              <div className="mb-8 space-y-4">
                                   <h2 className="text-3xl font-bold text-gray-800 tracking-wide">Trang Không Tồn Tại</h2>
                                   <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
                                        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển đến vị trí khác.
                                   </p>
                              </div>

                              {/* Illustration */}
                              <div className="mb-8">
                                   <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                                        <Search className="w-16 h-16 text-gray-400" />
                                   </div>
                              </div>

                              {/* Suggestions */}
                              <div className="mb-8">
                                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Bạn có thể thử:</h3>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                        <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                                             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                  <Home className="w-4 h-4 text-white" />
                                             </div>
                                             <div>
                                                  <h4 className="font-medium text-gray-800">Về trang chủ</h4>
                                                  <p className="text-sm text-gray-600">Quay lại trang chủ hệ thống</p>
                                             </div>
                                        </div>
                                        <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg">
                                             <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                  <HelpCircle className="w-4 h-4 text-white" />
                                             </div>
                                             <div>
                                                  <h4 className="font-medium text-gray-800">Liên hệ hỗ trợ</h4>
                                                  <p className="text-sm text-gray-600">Nhận trợ giúp từ đội ngũ kỹ thuật</p>
                                             </div>
                                        </div>
                                   </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                   <Link to="/">
                                        <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
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

                              {/* Additional Info */}
                              <div className="mt-8 pt-6 border-t border-gray-200">
                                   <p className="text-sm text-gray-500">
                                        Mã lỗi: 404 | Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ{" "}
                                        <a href="mailto:support@metro.vn" className="text-blue-600 hover:underline">
                                             support@metro.vn
                                        </a>
                                   </p>
                              </div>
                         </CardContent>
                    </Card>
               </div>
          </div>
     )
}
