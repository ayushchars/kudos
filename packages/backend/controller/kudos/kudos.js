import express from "express"
import {sendKudos ,getKudosAnalytics,getKudosFeed,likeKudos,getLikedKudos} from "./kudosController.js"

const router = express.Router()
router.post("/sendkudos", sendKudos)
router.get("/analytics" , getKudosAnalytics)
router.get("/getKudosFeed" , getKudosFeed)
router.post("/getLikedKudos" , getLikedKudos)
router.post("/likeKudos" , likeKudos)




export default router