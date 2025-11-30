import express from 'express'
import { protect } from '../middleware/Authmiddleware.js'
import {createFolder} from '../controllers/createFolder.js'
import {deleteFolder} from '../controllers/deleteFolder.js'
import {getTopLevelFolders} from '../controllers/getTopLevelFolders.js'
import { structureFolder } from '../controllers/structureFolder.js'

export const router = express.Router()

router.post('/create-folder',protect,createFolder)
router.get('/',protect,getTopLevelFolders)
router.post('/delete-folder',protect,deleteFolder)
router.get('/structure/:folderId',protect,structureFolder)