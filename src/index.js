const express = require('express');
const cors = require("cors")
const router = require('./routing/router')
const  mongoose  = require('mongoose');
const socket = require('socket.io')
require('dotenv').config()
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = mongoose.connect(process.env.MONGO_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
}).then(()=>console.log("db connected")).catch((e)=>console.log(e))
app.use(router)
app.get("/", (req,res)=>{
    res.send("Hello")
})

const server = app.listen(PORT,"0.0.0.0",console.log(`server started at ${PORT}`))
const io = socket(server,{
    cors:{
        origin:"https://whatsapp-clone.onrender.com",
        Credential:true
    }
})

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});