/** 分类列表来自 categories.json；文章放在同名子文件夹，Obsidian 模板按文件夹名填 category */
import categoriesList from '../content/blog/categories.json';

export const CATEGORIES = categoriesList as readonly [string, ...string[]];

export type Category = (typeof CATEGORIES)[number];
