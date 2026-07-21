---
pubDate: 2026-07-15
category: 八股
tags:
  - Java
---
# 是什么
Java 集合框架是一套统一的标准架构, 用来存储和操作一组对象, 提供接口, 算法和实现类  
集合类就是集合框架中的具体实现类  
通俗理解:
- 集合框架 = 设计图纸
- 集合类 = 根据集合框架造出的具体盒子
# 整体架构图
``` 
Iterable (接口)
   │
   └── Collection (接口)
          ├── List (接口) —— 有序、可重复
          │      ├── ArrayList
          │      ├── LinkedList
          │      └── Vector (线程安全，古老)
          │             └── Stack
          │
          ├── Set (接口) —— 无序、不可重复
          │      ├── HashSet
          │      │      └── LinkedHashSet (有序)
          │      ├── TreeSet (排序)
          │      └── EnumSet
          │
          └── Queue (接口) —— 队列
                 ├── LinkedList (也实现了List)
                 ├── PriorityQueue (优先级队列)
                 └── ArrayDeque (双端队列)

Map (接口) —— 键值对
       ├── HashMap
       │      └── LinkedHashMap (有序)
       ├── TreeMap (排序)
       ├── Hashtable (线程安全，古老)
       ├── ConcurrentHashMap (并发高效)
       └── EnumMap
```
总共有两大接口 `Collection` 接口和 `Map` 接口
## Collection

`Collection` 继承 `Iterable`, 表示可迭代, 可以用迭代器和增强 for 循环  
`Collection` 就表示存储单个元素的容器  
它有三大子接口  
`List`, `Set` 和 `Queue`
## Map
`Map` 存储方式有键值对, 比如 `HashMap`

# 哪些是线程安全和不安全的
位于 `java.util` 包里的是线程不安全的  
大部分集合线程都不安全  
在 `java.util.concurrent` 包里的是线程安全的  
比如 `ConcurrentHashMap`

# 为什么这么设计
1. 性能考虑: 同步会带来性能开销, 单线程场景下不需要
2. 设计选择: 把设计选择交给开发者
