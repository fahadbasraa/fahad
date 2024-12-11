import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
        description:{
            type:string,
            require:true
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        name:{
            type:string,
            require:true
        },
        productImage:{
            type:string
        },
        price:{
            type:Number,
            default:0
        },
        stock:{
            type:Number,
            default:0
        },
        catogory:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        }

},{timestamps:true})

export const Product = mongoose.model("Product",productSchema)