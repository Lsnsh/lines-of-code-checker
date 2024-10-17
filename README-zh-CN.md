# code-line-count-check

`code-line-count-check` 是一个 NodeJS 命令行工具，用于检查指定目录下超过指定行数的文件，并输出控制台日志或日志文件。

使用其他语言阅读：[English](./README.md) | 简体中文

## 特性

- 检查指定目录及其子目录中的文件行数
- 支持设置行数阈值
- 输出结果到控制台或日志文件

## 安装

使用 npm 安装：

```bash
npm install -g code-line-count-check
```

## 使用方法

### 命令行选项

```bash
clcc [options]
```

### 选项

- `-d, --directory <path>` 指定要检查的目录 (默认当前目录)
- `-l, --lines <number>` 设置行数阈值 (默认 100 行)
- `-o, --output <path>` 输出日志文件到指定目录 (默认输出到控制台)

### 示例

检查当前目录中超过默认阈值 100 行的文件，并将结果输出到控制台：

```bash
clcc
```

检查当前目录中超过 200 行的文件，并将结果输出到控制台：

```bash
clcc -l 200
```

检查 `path/to/directory` 目录中超过 200 行的文件，并将结果输出到控制台：

```bash
clcc -l 200 -d path/to/directory
```

检查 `path/to/directory` 目录中超过 200 行的文件，并将结果输出到 `path/to/output` 目录：

```bash
clcc -l 200 -d path/to/directory -o path/to/output
```

检查多个目录（`path/to/directory1` 和 `path/to/directory2`）中超过 200 行的文件，并将结果输出到 `path/to/output` 目录：

```bash
clcc -l 200 -d path/to/directory1,path/to/directory2 -o path/to/output
```

## 问题？

请提交问题。在提交之前，请先搜索现有的问题。
