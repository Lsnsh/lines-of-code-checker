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
- `-l, --lines <number>` Set the line threshold (default is 100 lines)
- `-o, --output <path>` Output the log to a specified directory (default is output to the console)

### Examples

Check files in the current directory that exceed 200 lines and output the results to the console:

```bash
clcc -l 200
```

Check files in the `/path/to/dir` directory that exceed 50 lines and output the results to the `logs` directory:

```bash
clcc -d /path/to/dir -l 50 -o logs
```

## Contributing

Feel free to submit issues and pull requests to help improve this project. Please make sure to read the [contributing guidelines](CONTRIBUTING.md) before submitting.

## Questions?

Please submit an issue. Before submitting, please search existing issues first.
