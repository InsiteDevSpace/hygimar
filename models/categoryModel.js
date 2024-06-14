import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    catg_name: {
      type: String,
      required: true,
      unique: true,
    },
    isMark: {
      type: Boolean,
    },
    subcategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
