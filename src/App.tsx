import { useEffect } from "react"
import { Route, Routes, Outlet } from 'react-router-dom'
import { AdminAuth } from './Auth/AdminAuth'
import { RequireAuth } from "./Auth/RequireAuth"
import { Toaster } from "./components/ui/sonner"
import MainLayout from "./layouts/MainLayout"
import AdminDashboard from "./pages/AdminDashBoard/AdminDashboard"
import AuthPage from "./pages/AuthPage/AuthPage"
import Home from "./pages/Home"
import ForbiddenPage from "./pages/PageStatus/ForbiddenPage"
import NotFoundPage from "./pages/PageStatus/NotFoundPage"
import ErrorPayment from "./pages/Payment/ErrorPayment"
import SuccessPayment from "./pages/Payment/SuccessPayment"
import TicketPurchaseSystem from "./pages/TicketPurchaseSystem/TicketPurchaseSystem"
import TrainSchedule from "./pages/TrainSchedule/TrainSchedule"
import UserDashboard from "./pages/UserDashboard/UserDashboard"
import { useUserStore } from "./store/userStore"
import StationScanner from "./pages/StationScanner"

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    }
  }, [fetchUser])

  return (
    <>
      <Toaster richColors position="top-center" />
      <Routes>
        {/* Admin routes - outside of MainLayout */}
        <Route element={<AdminAuth />}>
          <Route path="/station-scanner" element={<StationScanner />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>

        {/* Other routes with MainLayout */}
        <Route element={<MainLayout>
          <Outlet />
        </MainLayout>}>
          <Route path="/" element={<Home />} />
          <Route element={<RequireAuth />}>
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/ticket-purchase" element={<TicketPurchaseSystem />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/train-schedule" element={<TrainSchedule />} />
          <Route path="/payment/success" element={<SuccessPayment />} />
          <Route path="/payment/cancel" element={<ErrorPayment />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
