import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    id_role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      default: "Administrateur",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
