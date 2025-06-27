import Home from "./pages/Home"
import { Routes, Route } from 'react-router-dom'
import UserDashboard from "./pages/UserDashboard/UserDashboard"
import MainLayout from "./layouts/MainLayout"
import AuthPage from "./pages/AuthPage/AuthPage"
import Tickets from "./pages/UserDashboard/Tickets"
import TrainSchedule from "./pages/TrainSchedule/TrainSchedule"
import { Toaster } from "./components/ui/sonner"

function App() {

  return (
    <MainLayout>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/tickets" element={<Tickets />} />
        <Route path="/train-schedule" element={<TrainSchedule />} />
      </Routes>
    </MainLayout>
  )
}

export default App
