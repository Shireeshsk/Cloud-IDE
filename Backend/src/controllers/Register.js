import { User } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";
export const register = async (req,res)=>{
    console.log("Register route hit")
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        console.log(username,email,password)
        return res.status(401).json({
            success : false,
            message : "All Credentials Required"
        })
    }
    try{
        console.log(username,email,password)
        const findUser = await User.findOne({email})
        if(findUser){
            console.log("User already exists")
            return res.status(401).json({
                success : false,
                message : "User already exists"
            })
        }
        console.log("User does not exist")
        const newUser = new User({username,email,password})
        console.log("new user created")
        await newUser.save()
        console.log("new user saved")
        const user = newUser.toObject();
        delete user.password;
        const token = generateToken(newUser)
        console.log(token)
        console.log("success")
        return res.status(200).json({
            success : true,
            message : "Registration Successful",
            token : token,
            user : user
        })
    }catch(err){
        console.log("failure")
        console.log(err)
        return res.status(501).json({
            success : false,
            message : 'Internal Server error'
        })
    }
}