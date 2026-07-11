# 我的学习博客

基于 [Astro](https://astro.build) 的个人博客，用于记录算法题、八股和学习笔记。

## 本地开发

```bash
npm install
npm run dev
```

浏览器打开终端里显示的地址（一般是 `http://localhost:4321/my-blog/`）。

## 写文章

在 `src/content/blog/` 下新建 `.md` 文件，例如：

```md
---
title: 文章标题
description: 简短描述（可选）
pubDate: 2026-07-10
category: 算法题
tags: [动态规划, 回溯]
---

正文内容……
```

`category` 可选：`算法题`、`八股`、`学习笔记`。

## 部署

推送到 `main` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。

网站地址：https://Zekeriri.github.io/my-blog/

## 首次开启 GitHub Pages

1. 打开仓库 Settings → Pages
2. Source 选择 **GitHub Actions**
3. 推送代码后等待 Actions 跑完即可
