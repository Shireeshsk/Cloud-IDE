import express from 'express'
import { register } from '../controllers/Register.js'
import { login } from '../controllers/Login.js'
import { protect } from '../middleware/Authmiddleware.js'
import { userInfo } from '../controllers/userInfo.js'
export const router = express.Router()
router.post('/register',register)
router.post('/login',login)
router.get('/user-info',protect,userInfo)