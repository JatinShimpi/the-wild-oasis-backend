import mongoose from "mongoose";

const cabinsSchema = mongoose.Schema(
    {
        cabinNum:{
            type:String,
            required:true
        },
        cabinImage:{
            type:String,
            required:true
        },
        capacity:{
            type:String,
            required:true,
        },
        price:{
            type:String,
            required:true,
        },
        discount:{
            type:String,
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