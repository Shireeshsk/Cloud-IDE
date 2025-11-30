import jwt from "jsonwebtoken"
import {config} from "dotenv"
config()
export const generateToken = (user)=>{
    try{    
        const payload = {
            id : user._id,
            email : user.email
        }
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'})
        return token
    }catch(err){
        console.log(err)
    }
}