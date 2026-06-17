export const PROFESSIONAL_START = { year: 2012, month: 7 } as const;

export function calculateYears(start: { year: number; month: number }): number {
  const now = new Date();
  const startDate = new Date(start.year, start.month - 1, 1);

  let years = now.getFullYear() - startDate.getFullYear();
  const monthDiff = now.getMonth() - startDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < startDate.getDate())) {
    years--;
  }

  return Math.max(0, years);
}
