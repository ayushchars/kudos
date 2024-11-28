import express from "express"
import authRoute from "../controller/auth/auth.js"
import kudosRoute from "../controller/kudos/kudos.js"
const app = express();

app.use("/auth",authRoute)
app.use("/kudos",kudosRoute)

export default app