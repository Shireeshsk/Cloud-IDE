import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../utils/axiosInstance";

export const useAuthStore = create((set, get) => ({
    loading : false,
    user : null,
    register :async (data)=>{
        try{
            set({loading : true})
            const res = await axiosInstance.post('/auth/register',data)
            if(res.data.success){
                window.localStorage.setItem("token",res.data.token)
                set({user : res.data.user})
                toast.success(res.data.message)
                return true
            }
            toast.error(res.data.message)
            return false
        }catch(err){
            toast.err('something went wrong')
            return false
        }finally{
            set({loading : false})
        }
    },
    login : async (data)=>{
        try{
            set({loading : true})
            const res = await axiosInstance.post('/auth/login',data)
            if(res.data.success){
                window.localStorage.setItem("token",res.data.token)
                set({user : res.data.user})
                toast.success(res.data.message)
                return true
            }
            toast.error(res.data.message)
            return false
        }catch(err){
            toast.err('something went wrong')
        }finally{
            set({loading : false})
        }
    },
    logout : ()=>{
        window.localStorage.clear()
        set({user : null})
        toast.success("Logout Successful")
    },
    loadUser : async ()=>{
        try{
            set({loading : true})
            // console.log(window.localStorage.getItem('token'))
            const res = await axiosInstance.get('/auth/user-info',{
                headers : {
                    Authorization : `Bearer ${window.localStorage.getItem("token")}`
                }
            })
            // console.log(res)
            if(res.data.success){
                set({user : res.data.user})
                return true
            }
            toast.error(res.data.message)
            set({user : null})
            return false
        }catch(err){
            set({user : null})
            // toast.error("Something went Wrong")
            return false
        }finally{
            set({loading : false})
        }
    }
}));
