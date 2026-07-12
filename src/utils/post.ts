import { execSync } from 'node:child_process';
import { statSync } from 'node:fs';
import path from 'node:path';
import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

const dateCache = new Map<string, Date>();

/** 从 Git 或文件修改时间获取最后更新时间（构建时自动计算） */
function getFileUpdatedDate(id: string): Date | undefined {
  if (dateCache.has(id)) return dateCache.get(id);

  const filePath = path.join(BLOG_DIR, `${id}.md`);
  let date: Date | undefined;

  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf-8',
    }).trim();
    if (iso) date = new Date(iso);
  } catch {
    // 文件未纳入 Git 时忽略
  }

  if (!date) {
    try {
      date = statSync(filePath).mtime;
    } catch {
      // 文件不存在时忽略
    }
  }

  if (date) dateCache.set(id, date);
  return date;
}

function resolveUpdatedDate(post: BlogPost): Date {
  if (post.data.updatedDate) return post.data.updatedDate;
  return getFileUpdatedDate(post.id) ?? post.data.pubDate;
}

/** 网站标题：优先用 frontmatter title，否则用文件名 */
export function getPostTitle(post: { id: string; data: { title?: string } }) {
  const title = post.data.title?.trim();
  return title || post.id;
}

/** 页面显示的更新时间；与发布日期相同时不显示 */
export function getUpdatedDate(post: BlogPost): Date | undefined {
  const updated = resolveUpdatedDate(post);
  if (updated.toDateString() === post.data.pubDate.toDateString()) return undefined;
  return updated;
}

/** 排序用：取发布日期与最后更新日期中较新的 */
export function getSortDate(post: BlogPost) {
  return resolveUpdatedDate(post);
}

export function shouldShowUpdated(pubDate: Date, updatedDate?: Date) {
  if (!updatedDate) return false;
  return updatedDate.toDateString() !== pubDate.toDateString();
}

export function formatDate(date: Date) {
  return date.toLocaleDateString('zh-CN');
}
