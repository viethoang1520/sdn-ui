import { useUserStore } from "@/store/userStore"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export const AdminAuth = () => {
     const navigation = useNavigate()
     const token = localStorage.getItem('token')
     const user = useUserStore((state) => state.user)

     useEffect(() => {
          if (user && !user.isAdmin) {
               navigation('/403')
          }

          if (!token) {
               navigation('/403')
          }
     }, [user, navigation])

     return <Outlet />
}