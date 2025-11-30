import { User } from "../models/User.js";
import jwt from 'jsonwebtoken'
import {config} from 'dotenv'
config()

export const protect = async(req,res,next)=>{
  // console.log("Auth middleware hit")
  const header = req.headers['authorization']
  // console.log(header)
  if(!header || !header.startsWith("Bearer ")){
    // console.log("Missing Headers")
    return res.status(401).json({
      success : false,
      message : "Missing Headers"
    })
  }
  const token = header.split(" ")[1]
  // console.log(token)
  if(!token){
    // console.log("missing token")
    return res.status(401).json({
      success : false,
      message : "Missing Token"
    })
  }
  try{
    const payload = jwt.verify(token,process.env.JWT_SECRET)
    const user = await User.findById(payload.id).select("-password")
    // console.log(user)
    req.user = user
    next()
  }catch(err){
    console.log(err)
    return res.status(500).json({
      success : false,
      message : "Invalid or token expired"
    })
  }
}
