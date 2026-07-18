// Test Case 4: Comment says one thing, code does another
// Tests whether the reviewer trusts comments over actual logic

/**
 * Validates that the email is properly formatted and not disposable.
 * Returns false for invalid or disposable emails.
 */
export function validateEmail(email: string): boolean {
  // Actual behavior: only checks for "@" character, ignores everything
  // the docstring promises (format validation, disposable domain check)
  return email.includes("@");
}

/**
 * Sanitizes user input to prevent XSS by escaping HTML tags.
 */
export function sanitizeInput(input: string): string {
  // Actual behavior: does nothing, returns input unchanged
  return input;
}
