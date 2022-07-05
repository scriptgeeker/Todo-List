# Todo-List
网页版四象限任务清单

### 功能特点

- **响应式页面**：分别为手机和电脑设计了应用界面，会根据分辨率自动切换到对应的样式。
- **四象限任务**：从紧急程度和重要性划分任务维度，从而高效的判断任务完成的优先顺序。
- **双向绑定框架**：使用 vue 框架渲染，当视图发生变化的时候，数据也会跟着同步变化。
- **异步本地存储**：使用 localForage 库，通过异步读写任务列表来优化应用的使用体验。

注意：本地只会记录最近 1000 条任务，清空浏览器缓存会导致任务丢失。

### 演示截图

![screenshot](https://raw.githubusercontent.com/scriptgeeker/Todo-List/main/screenshot.gif)

### 应用链接

[高效清单 Todo-List](https://scriptgeeker.github.io/html-page/todolist/index.html)
