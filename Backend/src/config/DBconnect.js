import mongoose from 'mongoose'
import {config} from 'dotenv'
config()

export const DBconnect = async function(){
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL) 
        console.log("DataBase Connect Successfully")
        console.log("HostName : ",connection.connection.host)
        console.log("DataBase Name : ",connection.connection.name)
    }catch(err){
        console.log(err)
        process.exit(0)
    }
}