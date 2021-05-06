const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  { 
username: {
  type:String,
  required:"Username is Required",
  unique:true
},
password: {
  type:String,
  required:"Password is Required"
},
},
  {
    timestamps:true
  }
  );

const User = mongoose.model("User", UserSchema);


module.exports = { User }