// Test Case 5: Oversized / deeply nested file
// Purpose: test whether the reviewer maintains accuracy on large diffs
// Generate ~500+ lines locally before opening the PR, e.g.:
//
//   for i in range(500):
//       print(f"export function autoGen{i}(x: number): number {{")
//       print(f"  if (x > 0) {{ if (x > 10) {{ if (x > 100) {{")
//       print(f"    return x * {i};")
//       print(f"  }} }} }}")
//       print("  return 0;")
//       print("}}")
//
// Mix in ONE real functional change buried around line 250, e.g. a
// silent integer overflow or an unguarded array index, and see if the
// reviewer flags it despite the surrounding noise.
