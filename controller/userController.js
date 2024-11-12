const User = require("../models/usermodels")
const bycrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const Chat = require("../models/chatModel")

exports.signUp  = async(req,res)=>{
   
    
    try{
        const {firstName,lastName,email,dateOfBirth,username,password} = req.body
        const hashpass = await bycrypt.hash(password,10)
     
        const user =  new User({firstName,lastName,email,dateOfBirth,username,password: hashpass})
  
        await user.save()
        res.redirect("/login")
    }catch(err){
        res.status(400).send(err.message)
    }
}

exports.signIn = async(req,res)=>{

    
    try{
       const {username,password}= req.body;
       const user = await User.findOne({username:username})
    //    console.log(user)
       if(user && await bycrypt.compare(password,user.password)){
        // console.log("nd d cjd c")
        const token = jwt.sign({userId:user._id},process.env.ACCESS_TOKEN_SECRET)
      
        res.cookie("token",token,{httpOnly:true})
        res.redirect("/chat")
       }else{
        console.log("user is not found")
       }

    }catch(err){
        res.status(400).send(err.message)
    }
}

exports.getUser = async (req, res) => {
    try {
        // console.log(req.user._id);
        const otherUsers = await User.find({ _id: { $nin: [req.user._id] } });
        res.render("chat", { currentUser: req.user, otherUsers });
    } catch (err) {
        res.status(400).send(err.message);
    }
};





exports.createChat = async(req,res)=>{

    try{
        console.log("smjdjfkbnb g")
        const {sender_id,receiver_id,message} = req.body
        const chat = new Chat({
            sender_id:sender_id,
            receiver_id:receiver_id,
            message:message,
        })
       const newChat = await chat.save()
        res.status(200).send({success: true,msg:"Chat inserted",data:newChat})
    }catch(err){
        res.status(400).send(err.message)
    }
 
}
