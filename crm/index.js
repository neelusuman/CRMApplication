const express= require('express')
const app = express()
const mongoose = require("mongoose")
const dbConfig = require("./configs/db.config")
const authController = require('./controllers/auth.controller')

mongoose.connect(dbConfig.DB_URL);
app.use(express.json())
const db = mongoose.connection
db.on("error", ()=> console.log("Can't connect to dB"))
db.once("open",()=>console.log("Connected to mongodb"))

let authRouter = require('./routes/auth.routes')
authRouter(app)

let userRouter = require("./routes/user.routes")
userRouter(app)

let ticketRouter = require("./routes/ticket.routes")
ticketRouter(app)

app.listen(3003,()=> console.log("localhost:3000"))