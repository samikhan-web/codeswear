// pages/api/create-checkout-session.js
import Stripe from "stripe";
import Order from "@/models/Order";
import Product from "@/models/Product";
import mongooseConnect from "@/middleware/mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    const { orderId } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, error: "Missing orderId" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: "Order not found" });
    }

    // --- Recompute total server-side using trusted product prices ---
    let recomputedTotal = 0;
    for (const it of order.products) {
      if (!it.productId) {
        recomputedTotal += Number(it.price || 0) * (Number(it.qty || 1));
        continue;
      }

      const dbProduct = await Product.findById(it.productId).lean();

      // ✅ Updated: Gracefully handle missing products (for old orders)
      if (!dbProduct) {
        console.warn(`⚠️ Product not found in DB for old order: ${it.name || it.productId}`);
        // fallback to stored order price for old products
        recomputedTotal += Number(it.price || 0) * Number(it.qty || 1);
      } else {
        recomputedTotal += Number(dbProduct.price || 0) * Number(it.qty || 1);
      }
    }

    // --- Delivery fee logic ---
    let deliveryFee = 0;
    if (recomputedTotal < 150) deliveryFee = 99;
    const finalAmount = recomputedTotal + deliveryFee;

    // ⚡ Update order.amount in DB to include delivery fee
    order.amount = finalAmount;
    await order.save();

    // --- Create Stripe session ---
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Your Order",
              description:
                deliveryFee > 0
                  ? `Subtotal: ₹${recomputedTotal}, Delivery Fee: ₹${deliveryFee}`
                  : `Subtotal: ₹${recomputedTotal}`,
            },
            unit_amount: Math.round(finalAmount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.headers.origin}/orders/${orderId}?status=success`,
      cancel_url: `${req.headers.origin}/orders/${orderId}?status=cancel`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    return res.status(200).json({ success: true, id: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    return res.status(500).json({ success: false, error: "Checkout failed" });
  }
}
