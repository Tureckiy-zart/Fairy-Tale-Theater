// Minimal className joiner — no dependency, keeps the primitive library lightweight
// (non_goals: no CSS-in-JS / extra libs). Filters falsy values and joins with a space.
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
