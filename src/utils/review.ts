import type { CollectionEntry } from 'astro:content';

export interface ReviewDay {
  date: string; // YYYY-MM-DD
  note: string;
}

const DATE_HEADING = /^#{1,3}\s+(\d{4})-(\d{1,2})-(\d{1,2})\s*$/;

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function normalizeDate(y: string, m: string, d: string) {
  return `${y}-${pad(Number(m))}-${pad(Number(d))}`;
}

/** 从正文解析复盘记录（按日期标题分段） */
export function parseReviewLog(body: string): ReviewDay[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const days: ReviewDay[] = [];
  let current: { date: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const text = current.lines.join('\n').trim();
    if (text) {
      days.push({
        date: current.date,
        note: text,
      });
    }
    current = null;
  };

  for (const line of lines) {
    const match = line.match(DATE_HEADING);
    if (match) {
      flush();
      current = {
        date: normalizeDate(match[1], match[2], match[3]),
        lines: [],
      };
      continue;
    }
    if (current) current.lines.push(line);
  }
  flush();

  const map = new Map<string, ReviewDay>();
  for (const day of days) map.set(day.date, day);
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function getReviewLogPost(posts: CollectionEntry<'blog'>[]) {
  return posts.find(
    (p) =>
      p.filePath?.endsWith('复盘.md') ||
      p.id === '提升自己/复盘' ||
      p.id.endsWith('/复盘')
  );
}
