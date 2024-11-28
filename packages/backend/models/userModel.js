import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({

    name: {
        type : String,
        required : true,
        trim  :true
    },  
    email :{ 
        type : String,
        required  :true,
        unique : true
    },
  
   role: {
    type: String,
    enum : ["USER","ADMIN"],
    default : "USER",
  },


},{timestamps : true})

export default mongoose.model("Users",UserSchema)