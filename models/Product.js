import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  size: { type: String },
  color: { type: String },
  availableQty: { type: Number, required: true },
});

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  desc: { type: String, required: true },
  img: { type: String, required: true },
  category: { type: String, required: true },
  sizes: [{ type: String }],   // ✅ array of sizes
  colors: [{ type: String }],  // ✅ array of colors
  price: { type: Number, required: true },
  availableQty: { type: Number, required: true },
  variants: [VariantSchema], // ✅ store size-color-wise stock
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
