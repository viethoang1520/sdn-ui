import Home from "./pages/Home"
import { Routes, Route } from 'react-router-dom'
import UserDashboard from "./pages/UserDashboard/UserDashboard"
import MainLayout from "./layouts/MainLayout"
import AuthPage from "./pages/AuthPage/AuthPage"
import Tickets from "./pages/UserDashboard/Tickets"
import TrainSchedule from "./pages/TrainSchedule/TrainSchedule"
import AdminDashboard from "./pages/AdminDashBoard/AdminDashboard"
// import TicketPurchaseFlow from "./pages/TicketPurchaseFlow/TicketPurchaseFlow"
import SuccessPayment from "./pages/Payment/SuccessPayment"
import ErrorPayment from "./pages/Payment/ErrorPayment"
import { Toaster } from "./components/ui/sonner"
import TicketPurchaseSystem from "./pages/TicketPurchaseSystem/TicketPurchaseSystem"
import { useUserStore } from "./store/userStore"
import { useEffect } from "react"

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
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/train-schedule" element={<TrainSchedule />} />
        <Route path="/ticket-purchase" element={<TicketPurchaseSystem />} />
        <Route path="/payment/success" element={<SuccessPayment />} />
        <Route path="/payment/error" element={<ErrorPayment />} />
      </Routes>
    </MainLayout>
  )
}

export default App
