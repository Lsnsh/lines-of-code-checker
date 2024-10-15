#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
// const { program } = require("commander");

// 获取命令行参数
const args = process.argv.slice(2);

// 获取目录参数，支持多个目录，用逗号分隔
const directoryArg = args[0] || "./"; // 如果没有提供参数，默认使用 './'
const outputDir = args[1] || "./"; // 如果没有提供参数，默认使用 './'

// TODO: 使用 commander 库解析命令行参数
// 参考：https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md
// - `-d, --directory <path>` Specify the directory to check (default is the current directory)
// - `-l, --lines <number>` Set the line threshold (default is 100 lines)
// - `-o, --output <file>` Output the log to a specified file (default is output to the console)

// program.option("-d, --directory <path>", "Specify the directory to check");
// program.option("-o, --output <path>", "Output the log to a specified file");
// program.option("-l, --lines <number>", "Set the line threshold");

const maxLines = 200; // 最大行数
const output = [];
const duration = 50;
let outputCount = 0;
let checkCount = 0;
const checkDirs = [...directoryArg.split(",")];

const logDir = outputDir;
const dateStr = new Date().toISOString();

// 拼接目录路径
const joinDirectoryPath = (subPath) => path.join(process.cwd(), subPath);

// 递归遍历目录
const checkDirectory = (directoryPath) => {
  // console.log(`Scanning directory: ${directoryPath}`);

  // 读取目录内容
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.error("Unable to scan directory: " + err);
    }

    // 遍历目录中的每个文件
    files.forEach((file) => {
      // console.log(`Checking file: ${file}`);
      const filePath = path.join(directoryPath, file);

      // 检查是否为文件
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return console.error("Unable to read file stats: " + err);
        }

        if (stats.isFile()) {
          // 读取文件内容
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              return console.error("Unable to read file: " + err);
            }

            // 计算文件行数
            const lines = data.split("\n").length;

            // 如果行数大于 maxLines 行，输出文件名和路径
            if (lines > maxLines) {
              // console.log(`File: ${filePath}, Lines: ${lines}`);
              output.push({
                file: filePath,
                lines: lines,
              });
            }
          });
        } else {
          // 如果是目录，递归调用 checkDirectory
          if (stats.isDirectory()) {
            checkDirectory(filePath);
          }
        }
      });
    });
  });
};

const regularCheck = () => {
  // 每隔 duration 毫秒检查一次是否遍历完成
  setInterval(() => {
    // console.log('outputCount:', outputCount, 'output.length:', output.length);

    // 如果 outputCount 有变化，说明还在遍历
    if (outputCount !== output.length) {
      checkCount = 0;
      outputCount = output.length;
      console.log("Scanning... " + outputCount + " files found");
    } else {
      checkCount++;
      console.log("Checking... " + checkCount + " times");
    }

    // 如果 outputCount 前后两次相等，说明遍历完成
    if (checkCount >= 2) {
      console.log("\n" + "Scan completed");
      console.log("Files with more than " + maxLines + " lines:" + "\n");
      // 输出文件名和行数
      output
        .sort((a, b) => b.lines - a.lines)
        .forEach((item) => {
          console.log(`File: ${item.file} , Lines: ${item.lines}`);
        });
      // 输出文件总数
      console.log("\n" + "Total files: " + output.length);
      // 输出检查日期
      console.log("Check date: " + dateStr);

      // --------------------------
      // 同时将日志输出到文件

      // 转义文件名中的空格和斜杠
      let logFile = `${dateStr
        .replaceAll("-", "_")
        .slice(0, 19)}-${maxLines}_line_check-${checkDirs}.log`;
      logFile = logFile.replace(/ /g, "_").replace(/\//g, "_");
      const logPath = joinDirectoryPath(`${logDir}/${logFile}`);
      fs.writeFileSync(
        logPath,
        "Files with more than " + maxLines + " lines:\n" + "\n"
      );
      output.forEach((item) => {
        fs.appendFileSync(
          logPath,
          `File: ${item.file} , Lines: ${item.lines}\n`
        );
      });
      fs.appendFileSync(logPath, "\n" + "Total files: " + output.length + "\n");
      fs.appendFileSync(logPath, "Check date: " + dateStr + "\n");

      // 退出进程
      process.exit();
    }
  }, duration);
};

const run = () => {
  // 指定要遍历的目录
  checkDirs.forEach((checkDir) => {
    checkDirectory(joinDirectoryPath(checkDir));
  });

  regularCheck();
};

run();
