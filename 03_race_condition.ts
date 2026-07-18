// Test Case 3: Race condition in async shared state
// Two concurrent calls can corrupt the counter due to no locking

let inventoryCount = 10;

export async function reserveItem(): Promise<boolean> {
  if (inventoryCount <= 0) return false;

  // Simulated async delay (e.g., DB round trip) before the decrement.
  // Between the check above and the decrement below, another call
  // can also pass the check, causing inventoryCount to go negative.
  await new Promise((resolve) => setTimeout(resolve, 50));

  inventoryCount -= 1;
  return true;
}

// Trigger with: await Promise.all([reserveItem(), reserveItem(), ... x20])
// Expected: never goes below 0. Buggy version: can go negative.
