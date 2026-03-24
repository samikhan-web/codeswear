import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function Stickers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/getproducts");
        const data = await res.json();
        if (data.success) {
          setProducts(data.products.filter((p) => p.category === "stickers"));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <Head>
        <title>Stickers - Codeswear.com</title>
        <meta
          name="description"
          content="Buy premium coding-themed Stickers from CodesWear.com"
        />
      </Head>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-16 mx-auto">
          {/* Heading */}
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-4xl text-3xl font-medium title-font mb-4 text-gray-900">
              Stickers Collection
            </h1>
            <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
              Decorate your laptop, desk, or workspace with our fun coding-themed stickers.
            </p>
          </div>

          {/* Loading State */}
          {loading ? (
            <p className="text-center w-full text-gray-500">Loading products...</p>
          ) : (
            <div className="flex flex-wrap -m-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <Link
                    key={product._id}
                    href={`/product/${product.category}/${product.slug}`}
                    className="lg:w-1/4 md:w-1/2 p-4 w-full"
                  >
                    <div className="relative block rounded-lg overflow-hidden shadow-md hover:shadow-xl hover:scale-105 transition-transform duration-300 bg-white">
                      {/* Out of Stock Badge */}
                      {product.availableQty === 0 && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
                          Out of Stock
                        </span>
                      )}

                      {/* Image */}
                      <div className="relative h-64 bg-gray-100">
                        <Image
                          src={product.img}
                          alt={product.title}
                          fill
                          className="object-cover object-center w-full h-full"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="mt-4 text-center p-2 space-y-2">
                        <h2 className="text-gray-900 title-font text-lg font-medium">
                          {product.title}
                        </h2>
                        <p className="text-sm text-gray-600 line-clamp-2">{product.desc}</p>
                        <p className="text-gray-800 font-semibold">${product.price}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-center w-full text-gray-500">
                  No stickers available right now.
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
