/** 分类列表来自同目录下的 categories.json（Obsidian 模板也会读这个文件） */
import categoriesList from '../content/blog/categories.json';

export const CATEGORIES = categoriesList as readonly [string, ...string[]];

export type Category = (typeof CATEGORIES)[number];
