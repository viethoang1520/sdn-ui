import Home from "./pages/Home"
import { Routes, Route } from 'react-router-dom'
import UserDashboard from "./pages/UserDashboard/UserDashboard"
import MainLayout from "./layouts/MainLayout"

function App() {

  return (
    <MainLayout>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/user-dashboard" element={<UserDashboard/>}/>
     </Routes>
    </MainLayout>
  )
}

export default App
