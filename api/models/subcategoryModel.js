import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  {
    id_catg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subcatg_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("subCategory", subcategorySchema);
