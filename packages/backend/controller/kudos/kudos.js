import express from "express"
import {sendKudos,getKudosAnalytics,getKudosTrends,getKudosAnalyticsByUser} from "./kudosController.js"

const router = express.Router()
router.post("/sendkudos", sendKudos)

// router.post("/getkudos" , fetchUserKudos)
router.get("/getKudosAnalytics" , getKudosAnalytics)
router.get("/getKudosTrends" , getKudosTrends)
router.get("/analytics/:userId" , getKudosAnalyticsByUser)


export default router