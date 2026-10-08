import type { CollectionEntry } from 'astro:content';

export const TRAINING_IDS = ['音准', '咽音', '颤音', '环倾'] as const;
export type TrainingId = (typeof TRAINING_IDS)[number];

export interface PracticeDay {
  date: string; // YYYY-MM-DD
  done: TrainingId[];
  note: string;
}

const DATE_HEADING =
  /^#{1,3}\s+(\d{4})-(\d{1,2})-(\d{1,2})\s*$/;

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

function normalizeDate(y: string, m: string, d: string) {
  return `${y}-${pad(Number(m))}-${pad(Number(d))}`;
}

/** 从正文解析打卡记录（按日期标题分段） */
export function parsePracticeLog(body: string): PracticeDay[] {
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  const days: PracticeDay[] = [];
  let current: { date: string; lines: string[] } | null = null;

  const flush = () => {
    if (!current) return;
    const text = current.lines.join('\n').trim();
    const done = TRAINING_IDS.filter((id) => text.includes(id));
    days.push({
      date: current.date,
      done,
      note: text,
    });
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

  // 同一天多次出现时，后面的覆盖前面的
  const map = new Map<string, PracticeDay>();
  for (const day of days) map.set(day.date, day);
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date));
}

export function getPracticeLogPost(posts: CollectionEntry<'blog'>[]) {
  return posts.find(
    (p) =>
      p.filePath?.endsWith('练习打卡.md') ||
      p.id === '声乐/练习打卡' ||
      p.id.endsWith('/练习打卡')
  );
}
