import path from 'node:path';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

/** 从 filePath 还原原始文件名（去掉 .md）；Astro 的 id 会把空格变 -、英文变小写 */
function titleFromFilePath(filePath?: string) {
  if (!filePath) return undefined;
  const base = path.basename(filePath);
  return base.replace(/\.md$/i, '') || undefined;
}

/** 网站标题：优先用 frontmatter title，否则用原始文件名 */
export function getPostTitle(post: {
  id: string;
  filePath?: string;
  data: { title?: string };
}) {
  const title = post.data.title?.trim();
  return title || titleFromFilePath(post.filePath) || post.id;
}

/** 排序用：按发布日期 */
export function getSortDate(post: BlogPost) {
  return post.data.pubDate;
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN');
}
