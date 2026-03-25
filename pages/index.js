import Head from "next/head";
import Image from "next/image";
import connectDb from "@/middleware/mongoose";
import Product from "@/models/Product";
import Link from "next/link";

export default function Home({ products }) {
  return (
    <>
      <Head>
        <title>Codeswear.com - Wear the code</title>
      </Head>

      {/* Hero Section */}
      <div className="relative h-[90vh] flex items-center justify-center text-white">

        {/* Background Image */}
        <Image
          src="/Home.png"
          alt="Wear the Code T-shirt"
          fill
          priority
          className="object-cover"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl">

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Wear The Code
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Express your developer identity with premium coding apparel.
          </p>

         <Link href="/tshirts">
         <button className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 rounded-xl shadow-lg hover:scale-105 transition font-semibold">
           Shop Now 
         </button>
         </Link>

        </div>
      </div>
      {/* Featured Products */}
     <div className="max-w-6xl mx-auto px-6 py-12">

       <h2 className="text-3xl font-bold text-center mb-10">
        Featured Products
       </h2>

     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

       {products.map((item) => (
        <div key={item._id} className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition">

        <img
          src={item.img}
          alt={item.title}
          className="w-full h-56 object-cover"
        />

        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">
            {item.title}
          </h3>

          <p className="text-gray-500 text-sm mb-2">
            ${item.price}
          </p>

        <Link href={`/product/${item.category}/${item.slug}`}>
         <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg hover:opacity-90 transition">
          View Product
         </button>
       </Link>
        </div>

      </div>
    ))}

  </div>
</div>
    </>
  );
}


export async function getServerSideProps() {
  await connectDb();

  let products = await Product.find({}).lean();

  // Shuffle products
  products = products.sort(() => 0.5 - Math.random());

  // Take only 8
  products = products.slice(0, 8);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}