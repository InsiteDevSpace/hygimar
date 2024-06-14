import mongoose from "mongoose";
const clientSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    business: {
      type: String,
    },
    phone: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Client", clientSchema);
