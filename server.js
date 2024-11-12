const express = require("express");
const mongoose = require("mongoose")
// const connectDb = require("./config/dbconnection")
const cookie = require("cookie-parser")
 require("dotenv").config()
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const route = require("./routes/route")
const User = require("./models/usermodels")
const Chat = require("./models/chatModel")

const app = express();

const server = http.createServer(app);
const io = socketIo(server);

let usp =io.of("/chat")

usp.on("connection",async function(socket){
  console.log("new connection")
  var userId = socket.handshake.auth.token
  console.log(userId)

  await User.findByIdAndUpdate({_id:userId},{$set:{is_online:"1"}})
  socket.broadcast.emit("getOnlineUser",{user_id:userId})

  socket.on("disconnect",async function(){
    console.log("disconnect")
    var userId = socket.handshake.auth.token
    socket.broadcast.emit("getofflineUser",{user_id:userId})
    await User.findByIdAndUpdate({_id:userId},{$set:{is_online:"0"}})
  })

  socket.on("newChat",function(data){
    socket.broadcast.emit('loadNewChat',data)
  })
  socket.on("existChat", async function(data){
  var chats =   await Chat.find({$or:[
     {sender_id:data.sender_id,receiver_id:data.receiver_id},
     {sender_id:data.receiver_id,receiver_id:data.sender_id},
  
  ]});
    console.log(data.sender_id,"reciever");
    
    
    console.log(chats);
    
  
    socket.emit("loadChat",{chats:chats});
    
  })
})



mongoose.connect(process.env.CONNECTION_STRING).then(()=>{console.log("DB conneted")})

app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(route)
app.use(cookie())


 
const PORT =  7071;
server.listen(PORT,() => {
  console.log(`server is running on PORT ${PORT}`);
});

