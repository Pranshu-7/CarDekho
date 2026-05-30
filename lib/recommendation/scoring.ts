import { Car } from "@prisma/client";
import { IntentWeights, ScoredCar } from "./types";

type Stats = {
  minPrice: number;
  maxPrice: number;
  minMileage: number;
  maxMileage: number;
  minSafety: number;
  maxSafety: number;
  minPower: number;
  maxPower: number;
};

function computeStats(cars: Car[]): Stats {
  const prices = cars.map((c) => c.price);
  const mileages = cars.map((c) => c.mileage ?? 0);
  const safeties = cars.map((c) => c.safetyRating ?? 0);
  const powers = cars.map((c) => c.power ?? 0);

  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
    minMileage: Math.min(...mileages),
    maxMileage: Math.max(...mileages),
    minSafety: Math.min(...safeties),
    maxSafety: Math.max(...safeties),
    minPower: Math.min(...powers),
    maxPower: Math.max(...powers)
  };
}

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

export function scoreCars(cars: Car[], intent: IntentWeights, maxResults = 10): ScoredCar[] {
  if (cars.length === 0) return [];

  const stats = computeStats(cars);

  const weightsRaw = {
    safety: intent.safety,
    mileage: intent.mileage,
    valueForMoney: intent.valueForMoney,
    performance: intent.performance
  };

  const sum = Object.values(weightsRaw).reduce((acc, v) => acc + v, 0) || 1;
  const weights = {
    safety: weightsRaw.safety / sum,
    mileage: weightsRaw.mileage / sum,
    valueForMoney: weightsRaw.valueForMoney / sum,
    performance: weightsRaw.performance / sum
  };

  const scored: ScoredCar[] = cars.map((car) => {
    const priceScore = 1 - normalize(car.price, stats.minPrice, stats.maxPrice);

    const mileageScore =
      car.mileage != null ? normalize(car.mileage, stats.minMileage, stats.maxMileage) : 0.5;

    const safetyScore =
      car.safetyRating != null
        ? normalize(car.safetyRating, stats.minSafety, stats.maxSafety)
        : 0.5;

    const performanceScore =
      car.power != null ? normalize(car.power, stats.minPower, stats.maxPower) : 0.5;

    const valueForMoneyScore = 0.6 * priceScore + 0.4 * mileageScore;

    const brandBoost = intent.preferBrands[car.make] ?? 0;

    const totalScore =
      brandBoost +
      weights.valueForMoney * valueForMoneyScore +
      weights.safety * safetyScore +
      weights.mileage * mileageScore +
      weights.performance * performanceScore;

    const reasons: string[] = [];

    if (brandBoost > 0) {
      reasons.push(`Matches your preference for ${car.make}.`);
    }

    if (weights.safety > 0.4 && safetyScore > 0.6) {
      reasons.push("Strong safety rating, aligned with your focus on safety.");
    }

    if (weights.mileage > 0.4 && mileageScore > 0.6) {
      reasons.push("Good mileage for cost-efficient driving.");
    }

    if (weights.valueForMoney > 0.4 && valueForMoneyScore > 0.6) {
      reasons.push("Offers good value for money within the dataset.");
    }

    if (weights.performance > 0.4 && performanceScore > 0.6) {
      reasons.push("Higher performance for a more powerful drive.");
    }

    if (reasons.length === 0) {
      reasons.push("Balanced overall choice given your preferences.");
    }

    return {
      car,
      score: totalScore,
      reasons,
      breakdown: {
        brandBoost,
        valueForMoneyScore,
        safetyScore,
        mileageScore,
        performanceScore
      }
    };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, maxResults);
}