// pages/product/[category]/[slug].js
import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";
import { toast } from "react-toastify";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaBolt, FaStar } from "react-icons/fa";
import { useState } from "react";

const Slug = ({ product, error, reviewCount = 0, addToCart, buyNow }) => {
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const allColors = [...new Set(product.variants?.map((v) => v.color))];
  const allSizes = [...new Set(product.variants?.map((v) => v.size))];

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showSelectWarning, setShowSelectWarning] = useState(false);
  const [pin, setPin] = useState("");
  const [pinStatus, setPinStatus] = useState("");

  const filteredSizes = selectedColor
    ? product.variants
        .filter((v) => v.color === selectedColor)
        .map((v) => v.size)
    : [];

  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  // ✅ Determine what selections are required based on category
  const requiresSize = ["tshirts", "hoodies"].includes(
    product.category.toLowerCase()
  );
  const requiresColor = ["tshirts", "hoodies", "mugs"].includes(
    product.category.toLowerCase()
  );

  const handleAddToCart = () => {
    if ((requiresColor && !selectedColor) || (requiresSize && !selectedSize)) {
      setShowSelectWarning(true);
      return;
    }

    setShowSelectWarning(false);
    addToCart(
      product.slug,
      1,
      product.price,
      product.title,
      requiresSize ? selectedSize : "N/A",
      requiresColor ? selectedColor : "default",
      product._id.toString()
    );
    toast.success("Added to cart!");
  };

  const handleBuyNow = () => {
    if ((requiresColor && !selectedColor) || (requiresSize && !selectedSize)) {
      setShowSelectWarning(true);
      return;
    }

    setShowSelectWarning(false);
    buyNow(
      product.slug,
      1,
      product.price,
      product.title,
      requiresSize ? selectedSize : "N/A",
      requiresColor ? selectedColor : "default",
      product._id.toString()
    );
    toast.success("Proceeding to checkout!");
  };

  const handleCheckPincode = async () => {
    if (!pin) {
      toast.error("Please enter a pincode first!");
      setPinStatus("");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/pincode`);
      const data = await res.json();
      if (data[pin]) {
        toast.success(
          `Delivery available in ${data[pin].city}, ${data[pin].state}`
        );
        setPinStatus("serviceable");
      } else {
        toast.error("Sorry! Pincode is not serviceable");
        setPinStatus("not-serviceable");
      }
    } catch {
      toast.error("Error checking pincode. Please try again.");
      setPinStatus("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          /{" "}
          <Link
            href={`/${product.category}`}
            className="hover:underline capitalize"
          >
            {product.category}
          </Link>{" "}
          / <span className="text-gray-700 capitalize">{product.title}</span>
        </nav>

        {/* Product Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white p-6 rounded-2xl shadow-lg">
          {/* Image */}
          <div className="flex items-center justify-center">
            <Image
              src={product.img}
              alt={product.title}
              width={500}
              height={500}
              className="rounded-xl object-contain"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
              {product.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">{product.desc}</p>

            {/* Price & Stock */}
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-semibold text-pink-600">
                ${product.price}
              </span>
              <span
                className={`text-sm px-3 py-1 rounded-full ${
                  product.availableQty > 0
                    ? "bg-pink-100 text-pink-600"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {product.availableQty > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* Ratings */}
            <div className="flex items-center space-x-2 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
              <span className="text-gray-500 text-sm ml-2">
                ({reviewCount} Reviews)
              </span>
            </div>

            {/* Color Selection */}
            {requiresColor && allColors.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Select Color</h3>
                <div className="flex space-x-2 items-center">
                  {allColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize("");
                        setShowSelectWarning(false);
                      }}
                      className={`w-8 h-8 rounded-full border cursor-pointer transition ${
                        selectedColor === color ? "ring-2 ring-pink-500" : ""
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {requiresSize && selectedColor && filteredSizes.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Select Size</h3>
                <div className="flex space-x-3">
                  {filteredSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(size);
                        setShowSelectWarning(false);
                      }}
                      className={`px-4 py-2 border rounded-lg transition ${
                        selectedSize === size
                          ? "bg-pink-500 text-white border-pink-500"
                          : "hover:bg-pink-100 border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Warning */}
            {showSelectWarning && (
              <p className="text-sm text-red-600">
                Please select required options before proceeding.
              </p>
            )}

            {/* Pincode Check */}
            <div className="pt-4">
              <h3 className="font-semibold mb-2">Check Delivery Availability</h3>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter Pincode"
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <button
                  onClick={handleCheckPincode}
                  className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-md transition"
                >
                  Check
                </button>
              </div>
              {pinStatus === "serviceable" && (
                <p className="text-green-600 text-sm mt-2">
                  ✅ Delivery available at your location.
                </p>
              )}
              {pinStatus === "not-serviceable" && (
                <p className="text-red-600 text-sm mt-2">
                  ❌ Sorry, delivery is not available at your location.
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.availableQty === 0}
                className={`flex-1 flex items-center justify-center px-5 py-3 rounded-lg shadow-md transition ${
                  product.availableQty === 0
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600 text-white"
                }`}
              >
                <FaShoppingCart className="mr-2" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.availableQty === 0}
                className={`flex-1 flex items-center justify-center px-5 py-3 rounded-lg shadow-md transition ${
                  product.availableQty === 0
                    ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                    : "bg-yellow-500 hover:bg-yellow-600 text-white"
                }`}
              >
                <FaBolt className="mr-2" /> Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

    //  get server site props

export async function getServerSideProps(context) {
  try {
    await connectDb();
    const { category, slug } = context.params;
    const product = await Product.findOne({ category, slug }).lean();

    // If no product found, show 404 page instead of "Product not found"
    if (!product) {
      return { notFound: true };
    }

    const reviewCount = Math.floor(Math.random() * (500 - 50 + 1)) + 50;

    return {
      props: { product: JSON.parse(JSON.stringify(product)), reviewCount },
    };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true };
  }
}

// ✅ Add this line at the very end
export default Slug;
