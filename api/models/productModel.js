import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    primaryImage: {
      type: String,
      required: true,
    },
    tec_sheet: {
      type: String,
    },
    id_catg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    id_subcatg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
      required: true,
    },
    quantity: {
      type: Number,
    },
    inStock: {
      type: Boolean,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
