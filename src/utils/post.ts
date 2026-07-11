import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

/** 网站标题：优先用 frontmatter title，否则用文件名 */
export function getPostTitle(post: { id: string; data: { title?: string } }) {
  const title = post.data.title?.trim();
  return title || post.id;
}

/** 排序用：有更新时间则用更新时间，否则用发布日期 */
export function getSortDate(post: BlogPost) {
  return post.data.updatedDate ?? post.data.pubDate;
}

export function shouldShowUpdated(pubDate: Date, updatedDate?: Date) {
  if (!updatedDate) return false;
  return updatedDate.toDateString() !== pubDate.toDateString();
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN');
}
