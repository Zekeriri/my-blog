---
pubDate: 2026-07-13
category: 算法题
tags:
  - 递归
  - 动态规划
---
[1137. 第 N 个泰波那契数 - 力扣（LeetCode）](https://leetcode.cn/problems/n-th-tribonacci-number/description/)

# 1. 递归

思路自然

```python
class Solution:
    def tribonacci(self, n: int) -> int:
        @cache
        def tri(n):
            if n == 0: return 0
            if n == 1: return 1
            if n == 2: return 1
            return tri(n-1) + tri(n-2) + tri(n-3)
        
        return tri(n)
```

时间复杂度: O(n) 用记忆化优化, 从 O(3^n) 到 O(n)  
空间复杂度: O(n) 栈的深度

# 2. 动态规划

- 定义: dp[i] 表示第 i 个泰波那契数
- 状态转移方程: dp[i] = dp[i-1] + dp[i-2] + dp[i-3]
- 初始化: 0, 1, 1
- 顺序: 3->n
- 返回值: dp[n]

由于 dp[i] 只依赖前三个固定状态，可以用滚动数组优化

```python
class Solution:
    def tribonacci(self, n: int) -> int:
        if n == 0: return 0
        if n <= 2: return 1
        
        a, b, c = 0, 1, 1  
        for _ in range(3, n+1):
            a, b, c = b, c, a+b+c  # 三个变量滚动
        return c
```

时间复杂度: O(n)  
空间复杂度: O(n)
