import yaml from "js-yaml";

export function matter(input: string): { data: Record<string, unknown>; content: string } {
  const match = input.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, content: input };
  return {
    data: (yaml.load(match[1]) as Record<string, unknown>) ?? {},
    content: match[2],
  };
}
