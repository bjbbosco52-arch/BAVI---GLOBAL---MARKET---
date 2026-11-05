"use client";
import { useEffect, useState } from "react";

type Listing = {
  id: string; title: string; brand: string | null; pricePesewas: number;
  category: string; city: string | null; stock: number; allowPreorder: boolean;
};

const ghs = (p: number) => "GHS " + (p / 100).toLocaleString("en-GH");

export default function Home() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Listing[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");

  useEffect(() => {
    const term = q.trim();
    if (!term) { setResults([]); setState("idle"); return; }
    let live = true;
    setState("loading");
    const t = setTimeout(async () => {
      try {
        const r = await fetch("/api/listings?q=" + encodeURIComponent(term));
        if (!r.ok) throw new Error("bad");
        const data = await r.json();
        if (live) { setResults(data); setState("idle"); }
      } catch {
        if (live) setState("error");
      }
    }, 250);
    return () => { live = false; clearTimeout(t); };
  }, [q]);

  return (
    <main className="min-h-screen bg-[#0B1530] text-white">
      <header className="sticky top-0 z-10 border-b border-[#D4AF6A]/30 bg-[#070D20] px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center">
          <div className="text-lg font-bold tracking-widest text-[#D4AF6A]">BAVI GLOBAL</div>
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products, brands, categories..."
              aria-label="Search"
              className="w-full rounded-full border border-[#D4AF6A]/50 bg-white px-5 py-3 text-black outline-none focus:ring-2 focus:ring-[#D4AF6A]"
            />
            {q.trim() && (
              <div className="absolute mt-2 max-h-96 w-full overflow-auto rounded-xl bg-white text-black shadow-xl">
                {state === "loading" && <p className="p-4 text-sm">Searching...</p>}
                {state === "error" && <p className="p-4 text-sm">Search is unavailable. Please try again.</p>}
                {state === "idle" && results.length === 0 && <p className="p-4 text-sm">No match found.</p>}
                {state === "idle" && results.map((p) => (
                  <div key={p.id} className="flex justify-between gap-3 border-b p-3 text-sm hover:bg-[#F7F0E1]">
                    <span>
                      {p.title}
                      <span className="ml-2 text-xs text-purple-800">{p.category}</span>
                      {p.city && <span className="ml-2 text-xs text-gray-500">{p.city}</span>}
                      {p.stock === 0 && p.allowPreorder && <span className="ml-2 text-xs text-amber-700">Pre-order</span>}
                    </span>
                    <span className="whitespace-nowrap font-semibold">{ghs(p.pricePesewas)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button className="rounded-full bg-[#D4AF6A] px-5 py-2 font-semibold text-black">Sign in</button>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-16 text-center">
        <h1 className="text-3xl font-bold md:text-5xl">
          Buy. Sell. Rent. Swap. <span className="text-[#D4AF6A]">Safely.</span>
        </h1>
        <p className="mt-4 text-white/70">Ghana's trusted marketplace for products, pre-orders and more.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {["Electronics", "Phones", "Vehicles", "Home", "Fashion"].map((c) => (
            <span key={c} className="rounded-full bg-[#4B2A7B] px-4 py-2 text-sm">{c}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
