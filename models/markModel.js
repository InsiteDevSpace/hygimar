import mongoose from "mongoose";

const markSchema = new mongoose.Schema(
  {
    mark_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Mark", markSchema);
