import { User } from "../models/User.js";
import argon2 from 'argon2'
import { generateToken } from "../utils/generateToken.js";
export const login = async (req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        return res.status(401).json({
            success : false,
            message : "All Credentials Required"
        })
    }
    try{
        const findUser = await User.findOne({email})
        if(!findUser){
            return res.status(401).json({
                success : false,
                message : "User does not exists"
            })
        }
        const match = await argon2.verify(findUser.password,password)
        if(!match){
            return res.status(401).json({
                success : false,
                message : "Invalid Credentials"
            })
        }
        const token = generateToken(findUser)
        const user = findUser.toObject()
        delete user.password
        return res.status(200).json({
            success : true,
            message : "Login Successful",
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