import Home from "./pages/Home"
import { Routes, Route } from 'react-router-dom'
import UserDashboard from "./pages/UserDashboard/UserDashboard"
import MainLayout from "./layouts/MainLayout"
import AuthPage from "./pages/AuthPage/AuthPage"
import TrainSchedule from "./pages/TrainSchedule/TrainSchedule"

function App() {

  return (
    <MainLayout>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/user-dashboard" element={<UserDashboard/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      <Route path="/train-schedule" element={<TrainSchedule/>}/>
     </Routes>
    </MainLayout>
  )
}

export default App
