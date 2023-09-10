import { Navigate } from "react-router-dom";
import { Dashboard } from "./master/dashboard/Dashboard";
import { User } from "./admin/user/User"

export const AdminRoute =  [
    {path:'/', element: <Navigate to="/dashboard"/>},
    {path:'/dashboard', element: <Dashboard/>},
    {path:'/user', element:<User/>}
]