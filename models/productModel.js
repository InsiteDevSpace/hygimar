import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String, required: true }],
    primaryImage: { type: String, required: true },
    tec_sheet: { type: String },
    id_catg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    id_subcatg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    id_subsubcatg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubsubCategory",
    },
    id_mark: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mark",
    },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
