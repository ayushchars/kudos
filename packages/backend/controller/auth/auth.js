import express from "express"
import {loginControllar,registerControllar,getAllUsers} from "./authContoller.js"

const router = express.Router()
router.post("/register" , registerControllar)

router.post("/login" , loginControllar)
router.get("/getAllUser" , getAllUsers)


export default router