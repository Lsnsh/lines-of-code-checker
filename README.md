# lines-of-code-checker

[![NPM Version](https://img.shields.io/npm/v/lines-of-code-checker)](https://www.npmjs.com/package/lines-of-code-checker)
[![Build Status](https://img.shields.io/github/actions/workflow/status/lsnsh/lines-of-code-checker/tests.yml?branch=main&label=tests&logo=github)](https://github.com/lsnsh/lines-of-code-checker/actions?query=workflow%3ATests+branch%3Amain)

`lines-of-code-checker` is a NodeJS command-line tool for checking files in a specified directory that exceed a specified number of lines, and outputting the results to the console or a log file.

Read this in other languages: English | [简体中文](./README-zh-CN.md)

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

## Features

- Check the number of lines in files within a specified directory and its subdirectories
- Support for setting a line threshold
- Output results to the console or a log file

## Installation

Install using npm:

```bash
npm install -g lines-of-code-checker
```

## Usage

### Command Line Options

```bash
locc [options]
```

### Options

- `-d, --directory <paths>` Specify the directories to check, separated by commas (default is the current directory)
- `-l, --lines <number>` Set the line threshold (default is 200 lines)
- `-o, --output <path>` Output the log to a specified directory (default is output to the console)
- `-e --exclude <paths>` Specify the directories to exclude, separated by commas (default is .git and node_modules)

### Examples

Check files in the current directory that exceed the default threshold of 200 lines and output the results to the console:

```bash
locc
```

Check files in the current directory that exceed 200 lines and output the results to the console:

```bash
locc -l 200
```

Check files in the `path/to/directory` directory that exceed 200 lines and output the results to the console:

```bash
locc -l 200 -d path/to/directory
```

Check files in the `path/to/directory` directory that exceed 200 lines and output the results to the `path/to/output` directory:

```bash
locc -l 200 -d path/to/directory -o path/to/output
```

Check files in multiple directories (`path/to/directory1` and `path/to/directory2`) that exceed 200 lines and output the results to the `path/to/output` directory:

```bash
locc -l 200 -d path/to/directory1,path/to/directory2 -o path/to/output
```

## Questions?

Please submit an issue. Before submitting, please search existing issues first.
