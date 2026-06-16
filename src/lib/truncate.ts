export function smartTruncate(text: string, maxChars = 150): string {
  if (text.length <= maxChars) return text;

  const sub = text.slice(0, maxChars);
  const minCut = Math.floor(maxChars * 0.5);

  for (const end of [". ", "! ", "? "]) {
    const idx = sub.lastIndexOf(end);
    if (idx >= minCut) return text.slice(0, idx + 1) + "…";
  }

  for (const end of [", ", "; "]) {
    const idx = sub.lastIndexOf(end);
    if (idx >= minCut) return text.slice(0, idx + 1) + "…";
  }

  const spaceIdx = sub.lastIndexOf(" ");
  return text.slice(0, spaceIdx > 0 ? spaceIdx : maxChars) + "…";
}
