---
pubDate: 2026-07-17
category: 八股
tags:
  - Java
---
异常这个设计, 我觉得有点抽象, 难以理解  
首先解释一下异常是什么  
**Java 异常（Exception）** 是 Java 提供的一种**用于处理程序运行时出现的非正常情况**的机制。  
它本质上是一个**对象**（继承自 `Throwable` 类），这个对象封装了错误类型、错误信息、错误发生位置等详细信息。  
异常能做三件事,  
抛出 (`throw`/`throws`): **写方法的人**手动制造一个异常或者抛出  
`throw` 手动触发
```java
public void checkAge(int age) {
    if (age < 0) {
        throw new IllegalArgumentException("年龄不能是负数"); 
        // 你觉得这个情况太扯了，手动制造一个异常扔出去
    }
}
```
`throws` 预警
```java
// 你写了一个方法，但你知道它可能会出问题
public void readFile(String path) throws FileNotFoundException {
    // 如果文件不存在，Java会报错
    // 你在方法签名上加 throws，就是在说：
    // "调用我的人，你小心点，我这可能找不到文件"
}
```
捕获（`try-catch`）: **调用方法的人**接住异常并处理  
由调用的人负责
```java
try {
    readFile("a.txt");  // 调用上面那个可能抛异常的方法
} catch (FileNotFoundException e) {
    // 真出问题了，在这里解决
    System.out.println("文件没找到，我用默认配置");
    // 程序继续运行，不会崩溃
}
```
清理 (`finally`): **调用方法的人**处理, 无论有没有异常, 都要处理
```java
FileInputStream file = null;
try {
    file = new FileInputStream("a.txt");
    // 读文件...
} catch (IOException e) {
    System.out.println("读文件出错");
} finally {
    // 不管读没读出，关掉文件流（释放系统资源）
    if (file != null) {
        file.close();
    }
}
```

Java 把异常分为编译时异常和运行时异常
# 是什么
编译时异常编译器在编译阶段就能检查出来，必须在代码上显式处理的异常。  
运行时异常就是编译器在编译阶段检查不出来，只有在程序运行阶段才会暴露出来的异常，不强制在代码中显式处理。
# 为什么这么设计
运行时异常代表内部原因, **编程逻辑错误**, 比如数组越界, /0, 要程序员自己去处理, 而不是用 `try-catch` 包起来掩盖. 设计者希望出现这种问题时, 直接崩溃, 然后让程序员自己去改代码  
编译时异常代表外部原因, **外部不可抗因素**, 比如 IO, 数据库, 这种不是代码的问题, 是天然存在的失败风险. 这么设计的原因是让程序员在写代码时, 就想好了如果失败该怎么办, 提前想好对策
# 应用场景

- 编译时异常
  - 必须用 `try-catch` 或 `throws`, 并要给出补救措施
- 运行时异常
  - 不要 `try-catch`, 应该提前判断 (`if`...)
- 自定义异常
  - 大部分继承 `RuntimeException`
    - 利用 AOP（面向切面编程）统一处理异常，无需到处写 `try-catch`
    - 比如余额不足、库存不够，除了提示用户，调用者没什么好做的，没必要强制处理。
  - 特殊情况继承 `Exception`
    - 调用者必须针对这个异常做出不同的业务决策时
