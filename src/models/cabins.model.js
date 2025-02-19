import mongoose from "mongoose";

const cabinsSchema = mongoose.Schema(
    {
        cabinImage:{
            type:String,
            required:true
        },
        capacity:{
            type:Number,
            required:true,
        },
        price:{
            type:Number,
            required:true,
        },
        discount:{
            type:Number,
        },
        description:{
            type:String,
            required:true,
        }
    },
    {
        timestamps:true
    }
)

export const Cabin = mongoose.model("Cabin",cabinsSchema)