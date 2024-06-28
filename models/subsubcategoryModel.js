import mongoose from "mongoose";

const subsubcategorySchema = new mongoose.Schema(
  {
    id_subcatg: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subcategory",
      required: true,
    },
    subsubcatg_name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubsubCategory", subsubcategorySchema);
