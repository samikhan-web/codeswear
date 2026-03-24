import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";

const handler = async (req, res) => {
  try {
    // ✅ Clear old category data
    await Product.deleteMany({
      category: { $in: ["tshirts", "hoodies", "stickers", "mugs"] },
    });

    // ✅ Helper function to convert variant objects into arrays
    const convertVariants = (variantObj) => {
      const variantsArray = [];
      if (!variantObj) return variantsArray;

      for (const [color, sizes] of Object.entries(variantObj)) {
        if (typeof sizes === "object") {
          for (const [size, qty] of Object.entries(sizes)) {
            variantsArray.push({ color, size, availableQty: qty });
          }
        } else if (typeof sizes === "number") {
          // For simple items like mugs (color → qty)
          variantsArray.push({ color, availableQty: sizes });
        }
      }

      return variantsArray;
    };

    // ✅ Function to calculate total availableQty from variants
    const getTotalQty = (variantObj) => {
      if (!variantObj) return 0;
      let total = 0;
      for (const val of Object.values(variantObj)) {
        if (typeof val === "object") {
          total += Object.values(val).reduce((a, b) => a + b, 0);
        } else if (typeof val === "number") {
          total += val;
        }
      }
      return total;
    };

    // ✅ T-SHIRTS (8 items)
    const tshirts = [
      {
        title: "Debugging Mode",
        slug: "debugging-mode",
        desc: "Premium cotton t-shirt for coders who love debugging.",
        img: "/images/t-shirts/t-shirt1.jpg",
        category: "tshirts",
        variants: {
          Black: { S: 5, M: 8, L: 10, XL: 6 },
          Blue: { S: 4, M: 6, L: 9, XL: 3 },
          Yellow: { S: 7, M: 5, L: 4, XL: 2 },
        },
        price: 20,
      },
      {
        title: "Eat Sleep Code Repeat",
        slug: "eat-sleep-code-repeat",
        desc: "Classic tee for coders who live the cycle of Eat, Sleep, Code, Repeat.",
        img: "/images/t-shirts/t-shirt2.jpg",
        category: "tshirts",
        variants: {
          White: { M: 6, L: 10, XL: 8 },
          Blue: { M: 5, L: 9, XL: 7 },
          Red: { M: 4, L: 8, XL: 5 },
        },
        price: 22,
      },
      {
        title: "Hello World Tee",
        slug: "hello-world-tee",
        desc: "Soft cotton t-shirt with classic print for beginners and pros alike.",
        img: "/images/t-shirts/t-shirt3.jpg",
        category: "tshirts",
        variants: {
          White: { S: 6, M: 10, L: 12, XXL: 5 },
          Red: { S: 4, M: 9, L: 8, XXL: 3 },
          Green: { S: 3, M: 5, L: 6, XXL: 2 },
        },
        price: 18,
      },
      {
        title: "Code & Chill",
        slug: "code-and-chill",
        desc: "Perfect tee for relaxed coding sessions or casual hangouts.",
        img: "/images/t-shirts/t-shirt4.jpg",
        category: "tshirts",
        variants: {
          Gray: { M: 4, L: 6, XL: 5 },
          Black: { M: 6, L: 8, XL: 4 },
          Blue: { M: 5, L: 9, XL: 7 },
        },
        price: 25,
      },
      {
        title: "Stack Overflow Fan",
        slug: "stack-overflow-fan",
        desc: "Because no coder survives without Stack Overflow.",
        img: "/images/t-shirts/t-shirt5.png",
        category: "tshirts",
        variants: {
          Black: { S: 3, M: 5, L: 7 },
          Yellow: { S: 4, M: 6, L: 5 },
          White: { S: 6, M: 7, L: 8 },
        },
        price: 24,
      },
      {
        title: "Syntax Error",
        slug: "syntax-error",
        desc: "When you miss a semicolon but still look cool.",
        img: "/images/t-shirts/t-shirt6.jpg",
        category: "tshirts",
        variants: {
          Red: { M: 4, L: 7, XL: 6 },
          White: { M: 5, L: 8, XL: 7 },
          Gray: { M: 3, L: 4, XL: 3 },
        },
        price: 19,
      },
      {
        title: "404 Not Found",
        slug: "404-not-found",
        desc: "Funny and geeky, a must-have for web developers.",
        img: "/images/t-shirts/t-shirt7.jpg",
        category: "tshirts",
        variants: {
          Black: { S: 6, L: 5, XL: 3, XXL: 2 },
          Gray: { S: 3, L: 6, XL: 4, XXL: 3 },
          Green: { S: 4, L: 7, XL: 5, XXL: 2 },
        },
        price: 21,
      },
      {
        title: "Binary Coder",
        slug: "binary-coder",
        desc: "Only true coders speak in 0 and 1. Wear your identity proudly.",
        img: "/images/t-shirts/t-shirt8.jpg",
        category: "tshirts",
        variants: {
          Green: { M: 5, L: 7, XL: 6, XXL: 3 },
          Black: { M: 6, L: 8, XL: 4, XXL: 2 },
          Blue: { M: 5, L: 6, XL: 5, XXL: 3 },
        },
        price: 23,
      },
    ];

    // ✅ HOODIES (8 items)
    const hoodies = [
      {
        title: "Debug Hoodie",
        slug: "debugging-mode-hoodie",
        desc: "Cozy hoodie for coders who debug in style.",
        img: "/images/hoodies/hoodie1.jpg",
        category: "hoodies",
        variants: {
          Black: { M: 4, L: 6, XL: 5 },
          Gray: { M: 5, L: 8, XL: 4 },
        },
        price: 35,
      },
      {
        title: "Code Hard Hoodie",
        slug: "code-hard",
        desc: "Stay warm while coding hard.",
        img: "/images/hoodies/hoodie2.jpg",
        category: "hoodies",
        variants: {
          Blue: { S: 3, M: 5, L: 4 },
          Black: { S: 4, M: 6, L: 5 },
        },
        price: 38,
      },
      {
        title: "Hello World Hoodie",
        slug: "hello-world-hoodie",
        desc: "Classic hoodie for beginners and pros.",
        img: "/images/hoodies/hoodie3.jpg",
        category: "hoodies",
        variants: {
          White: { M: 6, L: 8, XL: 5 },
          Gray: { M: 5, L: 7, XL: 6 },
        },
        price: 32,
      },
      {
        title: "Chill Coder Hoodie",
        slug: "chill-coder",
        desc: "Relax and code with this premium hoodie.",
        img: "/images/hoodies/hoodie4.jpg",
        category: "hoodies",
        variants: {
          Black: { M: 4, L: 5, XL: 3 },
          Blue: { M: 6, L: 7, XL: 4 },
        },
        price: 40,
      },
      {
        title: "Stack Overflow Hoodie",
        slug: "stack-overflow-hoodie",
        desc: "A hoodie for true Stack Overflow fans.",
        img: "/images/hoodies/hoodie5.png",
        category: "hoodies",
        variants: {
          Black: { L: 4, XL: 3, XXL: 2 },
          Gray: { L: 3, XL: 4, XXL: 2 },
        },
        price: 42,
      },
      {
        title: "Syntax Hoodie",
        slug: "syntax-hoodie",
        desc: "For developers who write flawless syntax.",
        img: "/images/hoodies/hoodie6.jpg",
        category: "hoodies",
        variants: {
          Red: { M: 5, L: 6, XL: 4 },
          Black: { M: 6, L: 8, XL: 5 },
        },
        price: 34,
      },
      {
        title: "404 Hoodie",
        slug: "404-hoodie",
        desc: "Because sometimes you get lost in code.",
        img: "/images/hoodies/hoodie7.jpg",
        category: "hoodies",
        variants: {
          Gray: { S: 5, M: 6, L: 4 },
          Blue: { S: 3, M: 5, L: 6 },
        },
        price: 36,
      },
      {
        title: "Binary Hoodie",
        slug: "binary-hoodie",
        desc: "For coders who live in 0s and 1s.",
        img: "/images/hoodies/hoodie8.jpg",
        category: "hoodies",
        variants: {
          Green: { M: 5, L: 6, XL: 4 },
          Black: { M: 4, L: 5, XL: 3 },
        },
        price: 39,
      },
    ];

    // ✅ STICKERS (simple items)
    const stickers = [
      { title: "Debug Sticker", slug: "sticker-debug", desc: "Vinyl sticker for debugging lovers.", img: "/images/stickers/sticker1.png", category: "stickers", price: 5, availableQty: 50 },
      { title: "Code Life Sticker", slug: "sticker-code-life", desc: "Show your coding lifestyle with this sticker.", img: "/images/stickers/sticker2.png", category: "stickers", price: 6, availableQty: 40 },
      { title: "Hello World Sticker", slug: "sticker-hello-world", desc: "Classic sticker for coders.", img: "/images/stickers/sticker3.png", category: "stickers", price: 4, availableQty: 60 },
      { title: "Git Commit Sticker", slug: "sticker-git-commit", desc: "Sticker for Git commit lovers.", img: "/images/stickers/sticker4.png", category: "stickers", price: 7, availableQty: 30 },
      { title: "404 Sticker", slug: "sticker-404", desc: "Error not found? Stick it here.", img: "/images/stickers/sticker5.png", category: "stickers", price: 6.5, availableQty: 35 },
      { title: "Syntax Error Sticker", slug: "sticker-syntax-error", desc: "Sticker for funny syntax errors.", img: "/images/stickers/sticker6.png", category: "stickers", price: 5.5, availableQty: 45 },
      { title: "Binary Code Sticker", slug: "sticker-binary-code", desc: "Show your binary love.", img: "/images/stickers/sticker7.png", category: "stickers", price: 8, availableQty: 25 },
      { title: "Stack Overflow Sticker", slug: "sticker-stack-overflow", desc: "Sticker for Stack Overflow fans.", img: "/images/stickers/sticker8.png", category: "stickers", price: 9, availableQty: 20 },
    ];

    // ✅ MUGS (simple color → qty)
    const mugs = [
      {
        title: "Debug Mug",
        slug: "debug-mug",
        desc: "Ceramic mug for debugging sessions.",
        img: "/images/mugs/mug1.jpg",
        category: "mugs",
        variants: { white: 12, black: 18 },
        price: 15,
      },
      {
        title: "Code Coffee Mug",
        slug: "code-coffee",
        desc: "Start your day with code and coffee.",
        img: "/images/mugs/mug2.jpg",
        category: "mugs",
        variants: { blue: 10, mustard: 15 },
        price: 18,
      },
      {
        title: "Hello World Mug",
        slug: "hello-world-mug",
        desc: "Classic hello world design mug.",
        img: "/images/mugs/mug3.jpg",
        category: "mugs",
        variants: { orange: 14, red: 21 },
        price: 12,
      },
      {
        title: "Chill Coder Mug",
        slug: "chill-coder-mug",
        desc: "Relax and sip coffee while coding.",
        img: "/images/mugs/mug4.jpg",
        category: "mugs",
        variants: { black: 10, yellow: 15 },
        price: 16,
      },
      {
        title: "Stack Overflow Mug",
        slug: "stack-overflow-mug",
        desc: "For the devs who can’t live without Stack Overflow.",
        img: "/images/mugs/mug5.jpg",
        category: "mugs",
        variants: { white: 10, red: 8 },
        price: 20,
      },
      {
        title: "Syntax Mug",
        slug: "syntax-mug",
        desc: "Mug for clean syntax lovers.",
        img: "/images/mugs/mug6.jpg",
        category: "mugs",
        variants: { gray: 10, blue: 12 },
        price: 14,
      },
      {
        title: "404 Mug",
        slug: "404-mug",
        desc: "Error 404: Coffee not found.",
        img: "/images/mugs/mug7.jpg",
        category: "mugs",
        variants: { orange: 8, blue: 7 },
        price: 17,
      },
      {
        title: "Binary Mug",
        slug: "binary-mug",
        desc: "Mug for true binary coders.",
        img: "/images/mugs/mug8.jpg",
        category: "mugs",
        variants: { blue: 9, red: 11 },
        price: 19,
      },
    ];

    // ✅ Merge all products and convert variants to array format
    const allProducts = [...tshirts, ...hoodies, ...stickers, ...mugs].map((p) => ({
      ...p,
      variants: convertVariants(p.variants),
      availableQty: getTotalQty(p.variants) || p.availableQty || 0,
    }));

    await Product.insertMany(allProducts);

    res.status(200).json({
      success: true,
      message: "✅ Seeded all products successfully with per-variant quantities!",
    });
  } catch (error) {
    console.error("Seed Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default connectDb(handler);
