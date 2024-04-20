import { getAllPosts } from "@/lib/api";
import PostPreview from "@/app/_components/post-preview";

const HomePage = () => {
  const allPosts = getAllPosts();
  const allPostPreviews = allPosts.map((post) => (
    <PostPreview key={post.slug} {...post} />
  ));

  return (
    <main>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {allPostPreviews}
      </div>
    </main>
  );
};

export default HomePage;
