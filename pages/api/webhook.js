// pages/api/webhook.js
import { buffer } from "micro";
import Stripe from "stripe";
import connectDb from "@/middleware/mongoose";
import Order from "@/models/Order";

export const config = {
  api: { bodyParser: false },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    await connectDb();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;

        if (!orderId) {
          console.warn("⚠️ Checkout session completed has no metadata.orderId");
          return res.status(200).json({ received: true, warning: "Missing orderId metadata" });
        }

        const order = await Order.findById(orderId);
        if (!order) {
          console.warn(`⚠️ Order not found for ID: ${orderId}`);
          return res.status(404).json({ error: "Order not found" });
        }

        // Idempotency: skip if already paid
        if (order.paymentStatus === "paid") {
          console.log(`ℹ️ Order ${orderId} already marked as paid, skipping update.`);
          return res.status(200).json({ received: true });
        }

        // ⚡ Optional: amount mismatch check (log warning, do not block)
        const paidAmount = session.amount_total / 100;
        const expectedAmount = Number(order.amount || 0);
        if (Math.abs(paidAmount - expectedAmount) > 1) {
          console.warn(
            `⚠️ Amount mismatch for Order ${orderId}: expected=${expectedAmount}, got=${paidAmount}`
          );
        }

        // Mark order as paid
        order.status = "Paid";
        order.paymentStatus = "paid";
        order.paymentId = session.payment_intent;
        order.paymentDate = new Date();
        await order.save();

        console.log(`✅ Order ${orderId} successfully marked as paid.`);
        break;
      }

      default:
        console.info(`ℹ️ Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    console.error("❌ Webhook processing failed:", err);
    return res.status(500).json({ error: "Webhook processing failed" });
  }

  // Always respond 200 to Stripe
  res.status(200).json({ received: true });
};

export default handler;
