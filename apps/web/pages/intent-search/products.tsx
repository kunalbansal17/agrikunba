import { useEffect, useState } from "react";

type Product = {
  id: string;
  title: string;
  description?: string;
  price_cents?: number;
  currency?: string;
  url?: string;
  brand?: string;
  category?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/intent-search/products");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (e) {
        console.error("Failed to fetch products", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) return <p className="text-center p-8">Loading products…</p>;
  if (!products.length) return <p className="text-center p-8">No products found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-lg shadow-sm hover:shadow-md transition p-4 flex flex-col"
          >
            <h2 className="font-semibold text-lg mb-2">{p.title}</h2>
            <p className="text-sm text-gray-600 flex-1">
              {p.description || "No description"}
            </p>

            <div className="mt-4 flex justify-between items-center">
              <span className="font-medium text-indigo-600">
                {p.price_cents
                  ? `${(p.price_cents / 100).toFixed(2)} ${p.currency || "INR"}`
                  : "—"}
              </span>
              {p.url && (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View
                </a>
              )}
            </div>

            <div className="text-xs text-gray-500 mt-2">
              {p.brand && <span>Brand: {p.brand} · </span>}
              {p.category && <span>Category: {p.category}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
