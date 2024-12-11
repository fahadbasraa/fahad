import mongoose from "mongoose";

const userSchema = new mongoose.Schema({


},{timestamps:true})

exports const User = mongoose.model("User",userSchema)