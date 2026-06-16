export type Post = {
  slug: string;
  title: string;
  date: string;
  lastModified: string;
  excerpt: string;
  content: string;
  tags: string[];
};

export type Params = Promise<{
  slug: string;
}>;
