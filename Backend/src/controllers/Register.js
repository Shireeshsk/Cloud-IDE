import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
export const register = async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        return res.status(401).json({
            success : false,
            message : "All Credentials Required"
        })
    }
    try{
        const findUser = await User.findOne({email})
        if(findUser){
            return res.status(401).json({
                success : false,
                message : "User already exists"
            })
        }
        const newUser = new User({username,email,password})
        await newUser.save()
        const user = newUser.toObject();
        delete user.password;
        const token = generateToken(newUser)
        return res.status(200).json({
            success : true,
            message : "Registration Successful",
            token : token,
            user : user
        })
    }catch(err){
        console.log(err)
        return res.status(501).json({
            success : false,
            message : 'Internal Server error'
        })
    }
}