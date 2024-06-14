import mongoose from "mongoose";
const supplierSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    products_type: {
      type: String,
      required: true,
    },
    store: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);
