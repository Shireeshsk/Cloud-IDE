import Loader from "./Loader";
import { useAuthStore } from "../store/useAuthStore";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children}){
    const {user} = useAuthStore()
    if(!user){
        <Navigate to="/login" replace/>
    }
    return children
}