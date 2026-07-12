---
pubDate: 2026-07-12
category: 算法题
tags:
  - Python
---
Python 常用数据结构速查：

**数组 (list)**
- 创建：`[]`
- 尾部增删：`append(x)`, `pop()` （`pop()` 返回并移除末尾元素）
- 按下标操作：`arr[i]`

**栈 (list)**
- 同数组，用 `append()` 入栈，`pop()` 出栈（返回栈顶）

**队列 (collections.deque)**
- 创建：`from collections import deque; q = deque()`
- 入队：`append(x)`（右端）
- 出队：`popleft()`（左端，返回并移除）

**排序**
- 新列表：`sorted(arr)`
- 原地：`arr.sort()`
- 自定义：`arr.sort(key=lambda x: -x)`（降序）
- 多条件：`arr.sort(key=lambda x: (x[0], -x[1]))`（先按 x[0] 升，再按 x[1] 降）

**堆 / 优先级队列 (heapq)**
- 导入：`import heapq`
- 小根堆：`heapq.heappush(heap, x)`, `heapq.heappop(heap)`（弹出最小值）
- 大根堆：存负数 `-x`
- 替换堆顶：`heapq.heapreplace(heap, x)`（弹出最小并推入新值，比先 pop 再 push 快）

**字典 (dict)**
- 创建：`d = {}` 或 `d = dict()`
- 取值：`d[key]`（不存在报错）或 `d.get(key, default)`
- 计数：`from collections import Counter; Counter(arr)`
- **遍历**：
  - 遍历键：`for k in d:` 或 `for k in d.keys():`
  - 遍历值：`for v in d.values():`
  - 遍历键值对：`for k, v in d.items():`
- **取所有键/值**：`list(d.keys())`, `list(d.values())`, `list(d.items())`
- 排序（按 key）：`sorted(d.items())`
- 排序（按 value）：`sorted(d.items(), key=lambda x: x[1])`（升）或 `sorted(d.items(), key=lambda x: -x[1])`（降）