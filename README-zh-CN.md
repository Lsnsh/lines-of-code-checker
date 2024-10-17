# lines-of-code-checker

[![NPM Version](https://img.shields.io/npm/v/lines-of-code-checker)](https://www.npmjs.com/package/lines-of-code-checker)
[![Build Status](https://img.shields.io/github/actions/workflow/status/lsnsh/lines-of-code-checker/tests.yml?branch=main&label=tests&logo=github)](https://github.com/lsnsh/lines-of-code-checker/actions?query=workflow%3ATests+branch%3Amain)

`lines-of-code-checker` 是一个 NodeJS 命令行工具，用于检查指定目录下超过指定行数的文件，并输出控制台日志或日志文件。

使用其他语言阅读：[English](./README.md) | 简体中文

```bash
➜  commander.js git:(master) locc -l 500
Scanning... 9 files found
Scan completed

Exclude directories: .git,node_modules

Files with more than 500 lines:

File: /Users/lsnsh/github/commander.js/package-lock.json , Lines: 6490
File: /Users/lsnsh/github/commander.js/lib/command.js , Lines: 2510
File: /Users/lsnsh/github/commander.js/CHANGELOG.md , Lines: 1419
File: /Users/lsnsh/github/commander.js/Readme.md , Lines: 1158
File: /Users/lsnsh/github/commander.js/Readme_zh-CN.md , Lines: 1072
File: /Users/lsnsh/github/commander.js/typings/index.d.ts , Lines: 970
File: /Users/lsnsh/github/commander.js/typings/index.test-d.ts , Lines: 703
File: /Users/lsnsh/github/commander.js/lib/help.js , Lines: 521
File: /Users/lsnsh/github/commander.js/tests/command.positionalOptions.test.js , Lines: 521

Total files: 9
Check date: 2024-10-17T13:12:37.935Z
```

## 特性

- 检查指定目录及其子目录中的文件行数
- 支持设置行数阈值
- 输出结果到控制台或日志文件

## 安装

使用 npm 安装：

```bash
npm install -g lines-of-code-checker
```

## 使用方法

### 命令行选项

```bash
locc [options]
```

### 选项

- `-d, --directory <paths>` 指定要检查的目录，用逗号分隔 (默认是当前目录)
- `-l, --lines <number>` 设置行数阈值 (默认 200 行)
- `-o, --output <path>` 输出日志文件到指定目录 (默认输出到控制台)
- `-e, --exclude <paths>` 指定要排除的目录，用逗号分隔 (默认排除 .git 和 node_modules)

### 示例

检查当前目录中超过默认阈值 200 行的文件，并将结果输出到控制台：

```bash
locc
```

检查当前目录中超过 200 行的文件，并将结果输出到控制台：

```bash
locc -l 200
```

检查 `path/to/directory` 目录中超过 200 行的文件，并将结果输出到控制台：

```bash
locc -l 200 -d path/to/directory
```

检查 `path/to/directory` 目录中超过 200 行的文件，并将结果输出到 `path/to/output` 目录：

```bash
locc -l 200 -d path/to/directory -o path/to/output
```

检查多个目录（`path/to/directory1` 和 `path/to/directory2`）中超过 200 行的文件，并将结果输出到 `path/to/output` 目录：

```bash
locc -l 200 -d path/to/directory1,path/to/directory2 -o path/to/output
```

## 问题？

请提交问题。在提交之前，请先搜索现有的问题。
