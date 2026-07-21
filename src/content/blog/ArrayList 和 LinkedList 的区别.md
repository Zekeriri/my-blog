---
pubDate: 2026-07-15
category: 八股
tags:
  - Java
---
# 是什么
Java 集合框架中 List 接口下的两个集合类实现
# 作用
List 接口实现, 按顺序存储元素, 可以通过索引和下标访问任意位置的元素
# 底层
ArrayList 是由动态数组实现, 支持快速随机访问，但插入和删除效率较低  
LinkedList 是由双向链表实现, 插入和删除高效，但随机访问效率较低
# 应用场景
ArrayList, 适合**读多写少**的场景  
LinkedList, **同时实现了 `List` 和 `Deque` 接口**的容器，适合**频繁在两端操作**的场景
