import mongoose from "mongoose";
const livraisonSchema = new mongoose.Schema(
  {
    id_livreur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Livreur",
      required: true,
    },
    id_order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    city: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("livraison", livraisonSchema);
