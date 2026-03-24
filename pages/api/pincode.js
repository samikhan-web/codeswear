// pages/api/pincode.js
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  try {
    // Get the absolute path to pincodes.json
    const filePath = path.join(process.cwd(), "pincodes.json");

    // Read file
    const fileData = fs.readFileSync(filePath, "utf8");

    // Parse JSON
    const pincodes = JSON.parse(fileData);

    res.status(200).json(pincodes);
  } catch (error) {
    console.error("Error reading pincodes.json:", error);
    res.status(500).json({ error: "Unable to fetch pincodes" });
  }
}
