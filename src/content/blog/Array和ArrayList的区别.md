---
pubDate: 2026-07-14
category: 八股
tags:
  - Java
---
# 是什么
Array 是 Java 自带的长度固定的底层数据结构；ArrayList 是 Java 框架提供的长度可变的容器类，底层封装了 Array 来实现自动扩容。
# 作用
作用都是存储数据 ArrayList 可以在 Array 基础上自动扩容，并提供更多的 API。
# 底层

Array 是一段连续的内存空间。ArrayList 底层就是一个 Array，再加上 size 计数。当 size 达到最后长度时，会新建更大数组，把旧数据搬过去，实现自动扩容。
# 应用场景
大部分用 ArrayList，极致性能用 Array  
但在开发上, 用 ArrayList 就够了  
API 更多, 开发效率更高, 性能差异小到可以忽略不计
