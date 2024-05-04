export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  keywords: string[];
};

export type Params = {
  params: {
    slug: string;
  };
};
