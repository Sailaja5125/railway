import express from "express"
import cors from "cors"
import userrouter from "./routes/user.routs.js"

const app = express();
app.use(cors({
    origin : process.env.ORIGIN,
    credential : true
})) 
app.use(express.json()); 
app.use(express.urlencoded({extended:true})); 
app.use(express.static("public")); 


app.use("/api/v1/users",userrouter)
export {app}