// lib/recommendation/parseIntent.ts
export type IntentWeights = {
  preferBrands: Record<string, number>;
  valueForMoney: number;
  safety: number;
  mileage: number;
  performance: number;
  minBudget: number | null;
  maxBudget: number | null;
};

const brandSynonyms: Record<string, string[]> = {
  Honda: ["honda", "japanese"],
  Toyota: ["toyota", "japanese"],
  Maruti: ["maruti", "suzuki", "japanese"],
  Volkswagen: ["volkswagen", "vw", "german"],
  Skoda: ["skoda", "german"],
  BMW: ["bmw", "german"],
  Mercedes: ["mercedes", "benz", "german"],
  Tata: ["tata", "indian"],
  Hyundai: ["hyundai", "korean"],
  Kia: ["kia", "korean"]
};

function parseBudget(text: string): { minBudget?: number; maxBudget?: number } {
  const lower = text.toLowerCase().replace(/,/g, "").replace(/\s+/g, " ");
  let maxBudget: number | undefined;
  let minBudget: number | undefined;

  const lakhMatch = lower.match(/(\d+(\.\d+)?)\s*(lakh|lakhs|l)/);
  if (lakhMatch) {
    const value = parseFloat(lakhMatch[1]);
    const amount = value * 100000;
    if (
      lower.includes("under") ||
      lower.includes("below") ||
      lower.includes("<=") ||
      lower.includes("<")
    ) {
      maxBudget = amount;
    } else if (
      lower.includes("above") ||
      lower.includes("over") ||
      lower.includes(">=") ||
      lower.includes(">")
    ) {
      minBudget = amount;
    } else {
      maxBudget = amount;
    }
  }

  const rupeeMatch = lower.match(/(\d{5,8})/);
  if (!lakhMatch && rupeeMatch) {
    const value = parseInt(rupeeMatch[1], 10);
    if (
      lower.includes("under") ||
      lower.includes("below") ||
      lower.includes("<=") ||
      lower.includes("<")
    ) {
      maxBudget = value;
    } else if (
      lower.includes("above") ||
      lower.includes("over") ||
      lower.includes(">=") ||
      lower.includes(">")
    ) {
      minBudget = value;
    }
  }

  return { minBudget, maxBudget };
}

export function parseIntentDeterministic(query: string): IntentWeights {
  const lower = query.toLowerCase();

  const preferBrands: Record<string, number> = {};

  for (const [brand, keywords] of Object.entries(brandSynonyms)) {
    for (const key of keywords) {
      if (lower.includes(key)) {
        preferBrands[brand] = Math.max(preferBrands[brand] ?? 0, 3);
      }
    }
  }

  let safety = 1;
  if (
    lower.includes("safety") ||
    lower.includes("safe") ||
    lower.includes("family")
  ) {
    safety = 3;
  }

  let mileage = 1;
  if (
    lower.includes("mileage") ||
    lower.includes("fuel") ||
    lower.includes("economy")
  ) {
    mileage = 3;
  }

  let performance = 1;
  if (
    lower.includes("performance") ||
    lower.includes("power") ||
    lower.includes("fun to drive") ||
    lower.includes("sporty")
  ) {
    performance = 3;
  }

  let valueForMoney = 1;
  if (
    lower.includes("cost") ||
    lower.includes("budget") ||
    lower.includes("cheap") ||
    lower.includes("value for money") ||
    lower.includes("cost-efficient") ||
    lower.includes("cost efficient")
  ) {
    valueForMoney = 3;
  }

  const { minBudget, maxBudget } = parseBudget(query);

  return {
    preferBrands,
    valueForMoney,
    safety,
    mileage,
    performance,
    maxBudget: maxBudget ?? null,
    minBudget: minBudget ?? null
  };
}

// Simple wrapper used by the API
export async function getIntent(query: string): Promise<IntentWeights> {
  return parseIntentDeterministic(query);
}