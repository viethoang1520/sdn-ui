import { useEffect } from "react"
import { Route, Routes } from 'react-router-dom'
import { RequireAuth } from "./Auth/RequireAuth"
import { Toaster } from "./components/ui/sonner"
import MainLayout from "./layouts/MainLayout"
import AdminDashboard from "./pages/AdminDashBoard/AdminDashboard"
import AuthPage from "./pages/AuthPage/AuthPage"
import Home from "./pages/Home"
import ErrorPayment from "./pages/Payment/ErrorPayment"
import SuccessPayment from "./pages/Payment/SuccessPayment"
import TicketPurchaseSystem from "./pages/TicketPurchaseSystem/TicketPurchaseSystem"
import TrainSchedule from "./pages/TrainSchedule/TrainSchedule"
import UserDashboard from "./pages/UserDashboard/UserDashboard"
import { useUserStore } from "./store/userStore"

function App() {
  const fetchUser = useUserStore((state) => state.fetchUser)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser()
    }
  }, [])

  return (
    <MainLayout>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route element={<RequireAuth />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
          <Route path="/ticket-purchase" element={<TicketPurchaseSystem />} />
        </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/train-schedule" element={<TrainSchedule />} />
        <Route path="/payment/success" element={<SuccessPayment />} />
        <Route path="/payment/error" element={<ErrorPayment />} />
      </Routes>
    </MainLayout>
  )
}

export default App
