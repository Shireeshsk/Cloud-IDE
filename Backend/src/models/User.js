import mongoose from 'mongoose'
import argon2 from 'argon2'
const UserSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String ,
        unique : true,
        required : true,
        lowercase : true,
        trim : true
    },
    password : {
        type : String,
        required : true
    },
    storageUsed : {
        type : Number,
        default : 0
    },
    storagelimit : {
        type : Number ,
        default : 5 * 1024 * 1024 * 1024
    }
},{timestamps : true})

UserSchema.pre('save',async function(next){
    try{
        if(!this.isModified("password")) return next();
        this.password = await argon2.hash(this.password ,{
            type : argon2.argon2id,
            memoryCost : 2**16,
            timeCost : 3,
            parallelism : 1
        })
        next()
    }catch(err){
        next(err)
    }
})
export const User = mongoose.model("User",UserSchema)