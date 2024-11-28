import express from "express"
import {getUser, loginControllar,registerControllar,getAllUsers} from "./authContoller.js"

const router = express.Router()
router.post("/register" , registerControllar)

router.post("/login" , loginControllar)
router.get("/getUser" , getUser)
router.get("/getAllUser" , getAllUsers)


export default router