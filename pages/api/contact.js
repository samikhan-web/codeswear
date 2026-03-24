import mongoose from "mongoose";

// ✅ DB Connection
const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGO_URI);
};

// ✅ Schema
const ContactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
    status: {
      type: String,
      default: "unread",
    },
  },
  { timestamps: true }
);

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

// ✅ Handler
export default async function handler(req, res) {
  await connectDB();

  // GET all messages
  if (req.method === "GET") {
    const messages = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({ messages });
  }

  // DELETE message
  if (req.method === "DELETE") {
    const { id } = req.query;
    await Contact.findByIdAndDelete(id);
    return res.status(200).json({ success: true });
  }

  // UPDATE status
  if (req.method === "PUT") {
    const { id, status } = req.body;

    await Contact.findByIdAndUpdate(id, { status });

    return res.status(200).json({ success: true });
  }

  res.status(405).json({ message: "Method not allowed" });
}