import mongoose from "mongoose";


const categorySchema = new mongoose.Schema({

},{timestamps:true})


export const category = mongoose.model("category",categorySchema)