import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
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

// Ensure the slug field is unique and required
productSchema.index({ slug: 1 }, { unique: true });

export default mongoose.model("Product", productSchema);
