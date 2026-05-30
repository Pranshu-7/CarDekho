"use client";

import { useState } from "react";
import type { ScoredCar, IntentWeights } from "@/lib/recommendation/types";

type ApiResponse = {
  cars: ScoredCar[];
  intent: IntentWeights;
};

export default function HomePage() {
  const [query, setQuery] = useState(
    "I love German and Japanese engineered cars, mostly city driving, want good mileage and low ownership cost."
  );
  const [minBudget, setMinBudget] = useState<string>("");
  const [maxBudget, setMaxBudget] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ScoredCar[]>([]);
  const [intent, setIntent] = useState<IntentWeights | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function handleRecommend() {
    setLoading(true);
    setError(null);
    setResults([]);
    setIntent(null);
    setSelectedIds(new Set());

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          query,
          minBudget: minBudget ? Number(minBudget) : undefined,
          maxBudget: maxBudget ? Number(maxBudget) : undefined
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Failed to fetch recommendations.");
        return;
      }

      const data = (await res.json()) as ApiResponse;
      setResults(data.cars);
      setIntent(data.intent);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function toggleSelected(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
async function handleSaveShortlist() {
  if (!results.length) {
    setSaveError("Get recommendations first before saving.");
    return;
  }
  if (selectedIds.size === 0) {
    setSaveError("Please select at least one car to save.");
    return;
  }
  setSaveError(null);
  setSaving(true);
  try {
    const res = await fetch("/api/shortlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query,
        carIds: Array.from(selectedIds)
      })
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setSaveError(data?.error ?? "Failed to save shortlist.");
      return;
    }

    const data = (await res.json()) as { slug: string };
console.log("Saved shortlist slug:", data.slug);
window.location.href = `/shortlist/${data.slug}`;
  } catch {
    setSaveError("Something went wrong while saving shortlist.");
  } finally {
    setSaving(false);
  }
}
  function renderIntentSummary(intent: IntentWeights) {
    const level = (v: number) => {
      if (v >= 3) return "High";
      if (v >= 2) return "Medium";
      if (v >= 1) return "Low";
      return "None";
    };

    return (
      <div className="mt-4 rounded-md bg-slate-100 p-3 text-sm">
        <h3 className="font-semibold mb-1">How we prioritized</h3>
        <p className="mb-1">
          Safety: <span className="font-medium">{level(intent.safety)}</span>, Mileage:{" "}
          <span className="font-medium">{level(intent.mileage)}</span>, Value for money:{" "}
          <span className="font-medium">{level(intent.valueForMoney)}</span>, Performance:{" "}
          <span className="font-medium">{level(intent.performance)}</span>
        </p>
        {(intent.minBudget || intent.maxBudget) && (
          <p>
            Budget considered:{" "}
            {intent.minBudget ? `min ₹${intent.minBudget.toLocaleString()}` : ""}
            {intent.minBudget && intent.maxBudget ? ", " : ""}
            {intent.maxBudget ? `max ₹${intent.maxBudget.toLocaleString()}` : ""}
          </p>
        )}
      </div>
    );
  }

  return (
    <main>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">NextDrive</h1>
        <p className="text-slate-600 mt-1">
          Go from “I don&apos;t know what to buy” to a confident shortlist of cars.
        </p>
      </header>

      <section className="mb-8">
        <label className="block mb-2 text-sm font-medium text-slate-800" htmlFor="query">
          Describe your preferences
        </label>
        <textarea
          id="query"
          className="w-full rounded-md border border-slate-300 p-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="I love German and Japanese engineered cars, I mostly drive in city traffic, and I care a lot about safety and mileage."
        />
        <div className="mt-3 flex gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-800" htmlFor="minBudget">
              Min budget (₹)
            </label>
            <input
              id="minBudget"
              type="number"
              className="mt-1 w-40 rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800" htmlFor="maxBudget">
              Max budget (₹)
            </label>
            <input
              id="maxBudget"
              type="number"
              className="mt-1 w-40 rounded-md border border-slate-300 p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={handleRecommend}
          disabled={loading || query.trim().length === 0}
          className="mt-4 inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {loading ? "Computing shortlist..." : "Get my shortlist"}
        </button>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </section>

      {results.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-slate-900">Recommended cars</h2>
            <span className="text-xs text-slate-500">
              Showing top {results.length} matches
            </span>
          </div>

          <div className="space-y-3">
            {results.map((item) => {
              const { car } = item;
              const selected = selectedIds.has(car.id);
              return (
                <div
                  key={car.id}
                  className="flex items-start justify-between rounded-md border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-slate-900">
                        {car.make} {car.model}
                      </h3>
                      <span className="text-xs rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                        {car.bodyType ?? "Unknown"}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>Price: ₹{car.price.toLocaleString()}</span>
                      {car.mileage != null && <span>Mileage: {car.mileage} kmpl</span>}
                      {car.safetyRating != null && (
                        <span>Safety: {car.safetyRating.toFixed(1)} / 5</span>
                      )}
                      {car.power != null && <span>Power: {car.power} bhp</span>}
                      {car.fuelType && <span>Fuel: {car.fuelType}</span>}
                      {car.transmission && <span>Transmission: {car.transmission}</span>}
                    </div>
                    <p className="mt-2 text-sm text-slate-700">
                      Why this car: {item.reasons[0]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      id={`select-${car.id}`}
                      type="checkbox"
                      className="h-4 w-4"
                      checked={selected}
                      onChange={() => toggleSelected(car.id)}
                    />
                    <label
                      htmlFor={`select-${car.id}`}
                      className="text-xs text-slate-700 cursor-pointer"
                    >
                      {selected ? "Selected" : "Add to shortlist"}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>

          {intent && renderIntentSummary(intent)}
<div className="mt-4 flex items-center gap-3">
  <button
    type="button"
    onClick={handleSaveShortlist}
    disabled={saving}
    className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
  >
    {saving ? "Saving..." : "Save shortlist"}
  </button>
  {saveError && <p className="text-sm text-red-600">{saveError}</p>}
</div>
          {/* Save shortlist button will be wired in the next step */}
        </section>
      )}
    </main>
  );
}
