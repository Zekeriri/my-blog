---
pubDate: 2026-07-15
category: 八股
tags:
  - Java
---
# 是什么
String 是java.lang 包用于处理字符串的三个类, 其中String是不可变的, StringBuffer 和 StringBuilder是可变的
# 作用
存储和处理字符串
# 底层
String 由final修饰, 每次修改都会创建新对象
StringBuffer 内部的方法用 `synchronized`修饰, 是线程安全的
StringBuilder 是可扩展的字符数组, 修改时是直接操作该数组
# 应用场景
- 字符串不改变
- 多线程下字符串拼接
- 但线程下字符串拼接

