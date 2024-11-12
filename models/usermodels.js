const mongoose = require("mongoose")

const schema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email:{type:String,required:true},
  dateOfBirth: { type: Date, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  socketId:{type:String},
  is_online:{type:String,default:"0"}
},{
  timestamps:true,
})
module.exports = mongoose.model("users",schema)