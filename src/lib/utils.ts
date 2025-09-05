/**
 * Utility to join class names conditionally.
 * Filters out falsy values and joins the rest with a space.
 */
export function cn(...inputs: (string | undefined | false | null)[]) {
  return inputs.filter(Boolean).join(' ');
}