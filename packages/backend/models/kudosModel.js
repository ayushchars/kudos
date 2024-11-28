import mongoose from "mongoose";
const KudosSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", 
      required: true,
    },
    badges: {
      type: String,
    },
    message: {
      type: String,
      required: true,
    },
    likedby: {
      type: [mongoose.Schema.Types.ObjectId], 
      ref: "Users",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Kudos", KudosSchema);