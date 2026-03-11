# 个人记账应用

一个无需后端的简单个人记账工具，使用原生 HTML/CSS/JavaScript 实现。

## 功能

- 新增收入/支出记录（金额、分类、日期、备注）
- 自动汇总总收入、总支出与结余
- 删除单条记录
- 一键清空全部记录
- 使用 `localStorage` 持久化保存数据

## 本地运行

直接打开 `index.html` 即可使用，或通过简单静态服务器运行：

```bash
python3 -m http.server 8000
```

然后访问 <http://localhost:8000>。
