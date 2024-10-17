# code-line-count-check

`code-line-count-check` is a NodeJS command-line tool for checking files in a specified directory that exceed a specified number of lines, and outputting the results to the console or a log file.

Read this in other languages: English | [简体中文](./README-zh-CN.md)

## Features

- Check the number of lines in files within a specified directory and its subdirectories
- Support for setting a line threshold
- Output results to the console or a log file

## Installation

Install using npm:

```bash
npm install -g code-line-count-check
```

## Usage

### Command Line Options

```bash
clcc [options]
```

### Options

- `-d, --directory <path>` Specify the directory to check (default is the current directory)
- `-l, --lines <number>` Set the line threshold (default is 200 lines)
- `-o, --output <path>` Output the log to a specified directory (default is output to the console)

### Examples

Check files in the current directory that exceed the default threshold of 200 lines and output the results to the console:

```bash
clcc
```

Check files in the current directory that exceed 200 lines and output the results to the console:

```bash
clcc -l 200
```

Check files in the `path/to/directory` directory that exceed 200 lines and output the results to the console:

```bash
clcc -l 200 -d path/to/directory
```

Check files in the `path/to/directory` directory that exceed 200 lines and output the results to the `path/to/output` directory:

```bash
clcc -l 200 -d path/to/directory -o path/to/output
```

Check files in multiple directories (`path/to/directory1` and `path/to/directory2`) that exceed 200 lines and output the results to the `path/to/output` directory:

```bash
clcc -l 200 -d path/to/directory1,path/to/directory2 -o path/to/output
```

## Questions?

Please submit an issue. Before submitting, please search existing issues first.
