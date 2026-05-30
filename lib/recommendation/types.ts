export type IntentWeights = {
  preferBrands: Record<string, number>;
  valueForMoney: number;
  safety: number;
  mileage: number;
  performance: number;
  maxBudget?: number | null;
  minBudget?: number | null;
};

export type ScoredCar = {
  car: {
    id: number;
    make: string;
    model: string;
    bodyType: string | null;
    price: number;
    mileage: number | null;
    safetyRating: number | null;
    power: number | null;
    fuelType: string | null;
    transmission: string | null;
  };
  score: number;
  reasons: string[];
  breakdown: {
    brandBoost: number;
    valueForMoneyScore: number;
    safetyScore: number;
    mileageScore: number;
    performanceScore: number;
  };
};