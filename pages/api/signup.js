// pages/api/signup.js
import User from "@/models/User";
import connectDb from "@/middleware/mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const handler = async (req, res) => {
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: "Please provide all fields" });
      }

      // check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      // ✅ Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create new user
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      // ✅ Create JWT
      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.status(200).json({
        success: "Signup successful",
        token,
        user: { name: newUser.name, email: newUser.email },
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Server error. Please try again." });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};

export default connectDb(handler);
