/** Join class names, dropping falsy values. Keeps Tailwind classes tidy. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
