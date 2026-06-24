export function calculateRank(percentage: number): string {
  if (percentage >= 90) return "Nivel Davo Xeneize";
  if (percentage >= 75) return "Crack internacional";
  if (percentage >= 50) return "Buen conocedor";
  if (percentage >= 25) return "Nenazo TikTok";
  return "Mirá más fútbol, gaga";
}
