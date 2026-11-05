"use client";
import { useState } from "react";

const SAMPLE = [
  { name: "Samsung 55-inch Smart Television", cat: "Electronics", price: "GHS 3,200" },
  { name: "LG 43-inch LED Television", cat: "Electronics", price: "GHS 2,400" },
  { name: "Hisense 65-inch 4K Television", cat: "Electronics", price: "GHS 5,900" },
  { name: "iPhone 13 (used)", cat: "Phones", price: "GHS 6,500" },
  { name: "Toyota Corolla 2015", cat: "Vehicles", price: "GHS 78,000" },
  { name: "Standing Fan", cat: "Home", price: "GHS 350" },
];

export default function Home() {
  const [q, setQ] = useState("");
  const results = q.trim()
    ? SAMPLE.filter((p) =>
        (p.name + " " + p.cat).toLowerCase().includes(q.toLowerCase())
      )
    : [];

  return (
    <main className="min-h-screen bg-[#0B1530] text-white">
      <header className="sticky top-0 z-10 border-b border-[#D4AF6A]/30 bg-[#070D20] px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center">
          <div className="text-lg font-bold tracking-widest text-[#D4AF6A]">
            BAVI GLOBAL
          </div>
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands, categories..."
              aria-label="Search"
              className="w-full rounded-full border border-[#D4AF6A]/50 bg-white px-5 py-3 text-black outline-none focus:ring-2 focus:ring-[#D4AF6A]"
            />
            {q.trim() && (
              <div className="absolute mt-2 w-full overflow-hidden rounded-xl bg-white text-black shadow-xl">
                {results.length === 0 && (
                  <p className="p-4 text-sm">No match found.</p>
                )}
                {results.map((p) => (
                  <div
                    key={p.name}
                    className="flex justify-between border-b p-3 text-sm hover:bg-[#F7F0E1]"
                  >
                    <span>
                      {p.name}
                      <span className="ml-2 text-xs text-purple-800">{p.cat}</span>
                    </span>
                    <span className="font-semibold">{p.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="rounded-full bg-[#D4AF6A] px-5 py-2 font-semibold text-black">
            Sign in
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">
          Buy. Sell. Rent. Swap. <span className="text-[#D4AF6A]">Safely.</span>
        </h1>
        <p className="mt-4 text-white/70">
          Ghana's trusted marketplace for products, pre-orders and more.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Electronics", "Phones", "Vehicles", "Home", "Fashion"].map((c) => (
            <span key={c} className="rounded-full bg-[#4B2A7B] px-4 py-2 text-sm">
              {c}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}