import express from 'express'
import {config} from 'dotenv'
// import cookieParser from 'cookie-parser'
config()
import { minioConfig } from './config/minioConfig.js'
import cors from 'cors'
import { DBconnect } from './config/DBconnect.js'
import { router as Authroutes } from './routes/Authroutes.js'
import { router as FolderRoutes } from './routes/Folder-Routes.js'
import {router as FileRoutes} from './routes/File-Routes.js'

import path from 'path'

const port = process.env.PORT 
const app = express()

app.use(express.json())
app.use(express.urlencoded())
// app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173"
}))
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use('/api/auth',Authroutes)
app.use("/api/folders", FolderRoutes);
app.use("/api/files", FileRoutes);

DBconnect()
minioConfig()
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})