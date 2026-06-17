import { Post } from "@/interfaces/post";

export function countPostsByTag(
  posts: Post[],
  tags: string[]
): Record<string, number> {
  return Object.fromEntries(
    tags.map((tag) => [tag, posts.filter((p) => p.tags?.includes(tag)).length])
  );
}

export function sortTagsByPostCount(
  tags: string[],
  countByTag: Record<string, number>
): string[] {
  return [...tags].sort((a, b) => countByTag[b] - countByTag[a]);
}
