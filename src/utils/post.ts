type PostLike = {
  id: string;
  data: { title?: string };
};

/** 网站标题：优先用 frontmatter title，否则用文件名 */
export function getPostTitle(post: PostLike) {
  const title = post.data.title?.trim();
  return title || post.id;
}
