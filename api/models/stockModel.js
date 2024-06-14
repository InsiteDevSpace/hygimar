import mongoose, { Schema } from "mongoose";
const stockSchema = new mongoose.Schema(
  {
    id_supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    warehouse: {
      type: String,
      required: true,
    },
    info: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Stock", stockSchema);
