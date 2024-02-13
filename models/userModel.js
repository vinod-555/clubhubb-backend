// userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
       trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
      required: true,
    },
    collegeName: {
      type: String,
      trim: true,
      required: true,
    },
    
    password: {
      type: String,
      required: true,
    },
    userProfilePic: {
      data: Buffer,
      contentType: String,
    },
    eventsRegistered:[{
      eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'EventCreation'
      },
      qrCode:{
        type:String 
      }


    }],
    resetCode: {
      code: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
