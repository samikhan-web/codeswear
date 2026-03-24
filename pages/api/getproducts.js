import Product from "@/models/Product";
import connectDb from "@/middleware/mongoose";

const handler = async (req, res) => {
  try {
    let products = await Product.find();

    // ✅ Automatically generate sizes and colors if missing
    products = products.map((product) => {
      const p = product.toObject();

      // Generate sizes from variants if sizes array empty
      if ((!p.sizes || p.sizes.length === 0) && p.variants?.length > 0) {
        p.sizes = [...new Set(p.variants.map((v) => v.size).filter(Boolean))];
      }

      // Generate colors from variants if colors array empty
      if ((!p.colors || p.colors.length === 0) && p.variants?.length > 0) {
        p.colors = [...new Set(p.variants.map((v) => v.color).filter(Boolean))];
      }

      return p;
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export default connectDb(handler);
