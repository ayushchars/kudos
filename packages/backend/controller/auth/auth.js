import express from "express"
import {loginControllar,registerControllar,getAllUsers} from "./authContoller.js"
import { requireSignin } from "../../middleware/authMiddleware.js"

const router = express.Router()
router.post("/register" , registerControllar)

router.post("/login" , loginControllar)
router.get("/getAllUser" ,requireSignin, getAllUsers)


export default router