#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { program } = require("commander");
const pkg = require("../package.json");

program
  .version(pkg.version)
  .description("Check files in a directory for exceeding a line threshold")
  .usage("[options] <directory> [output]")
  .option(
    "-l, --lines <number>",
    "Set the line threshold (default is 200 lines)",
    200
  )
  .option(
    "-d, --directory <paths>",
    "Specify the directories to check, separated by commas (default is the current directory)",
    "./"
  )
  .option(
    "-o, --output <path>",
    "Output the log to a specified directory (default is output to the console)"
  )
  .option(
    "-e --exclude <paths>",
    "Specify the directories to exclude, separated by commas (default is .git and node_modules)",
    ".git,node_modules"
  );

program.addHelpText(
  "after",
  [
    "\nExample call:",
    "  $ locc",
    "  $ locc -l 200",
    "  $ locc -l 200 -d path/to/directory",
    "  $ locc -l 200 -d path/to/directory -o path/to/output",
    "  $ locc -l 200 -d path/to/directory1,path/to/directory2 -o path/to/output",
  ].join("\n")
);

program.parse(process.argv);

const options = program.opts();
const maxLines = options.lines;
const directoryArg = options.directory;
const outputDir = options.output;
const excludeDirs = options.exclude.split(",");
const checkDirs = [...directoryArg.split(",")];

run(checkDirs);

const outputInfos = [];

// 拼接目录路径
function joinDirectoryPath(subPath) {
  return path.join(process.cwd(), subPath);
}

// 匹配排除的目录
function matchExcludeDirectory(directoryPath) {
  const excludeDirectoryPaths = excludeDirs.map((dir) =>
    joinDirectoryPath(dir)
  );

  return excludeDirectoryPaths.includes(directoryPath);
}

// 递归遍历目录
function checkDirectory(directoryPath) {
  // 排除指定目录
  if (matchExcludeDirectory(directoryPath)) {
    return;
  }

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
              outputInfos.push({
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
}

// 定时检查是否遍历完成
function regularCheck(duration) {
  let outputCount = 0;
  let checkCount = 0;
  const dateStr = new Date().toISOString();

  // 每隔 duration 毫秒检查一次是否遍历完成
  setInterval(() => {
    // console.log('outputCount:', outputCount, 'outputInfos.length:', outputInfos.length);

    // 如果 outputCount 有变化，说明还在遍历
    if (outputCount !== outputInfos.length) {
      checkCount = 0;
      outputCount = outputInfos.length;
      console.log("Scanning... " + outputCount + " files found");
    } else {
      checkCount++;
      // console.log("Checking... " + checkCount + " times");
    }

    // 如果 outputCount 前后两次相等，说明遍历完成
    if (checkCount >= 2) {
      console.log("Scan completed");

      if (outputDir === undefined) {
        console.log("\nExclude directories: " + excludeDirs + "\n");
        console.log("Files with more than " + maxLines + " lines:" + "\n");
        // 输出文件名和行数
        outputInfos
          .sort((a, b) => b.lines - a.lines)
          .forEach((item) => {
            console.log(`File: ${item.file} , Lines: ${item.lines}`);
          });
        // 输出文件总数
        console.log("\n" + "Total files: " + outputInfos.length);
        // 输出检查日期
        console.log("Check date: " + dateStr);
      }

      // --------------------------
      // 同时将日志输出到文件

      // 转义文件名中的空格和斜杠
      if (outputDir !== undefined) {
        let logFile = `${dateStr
          .replaceAll("-", "_")
          .slice(0, 19)}-${maxLines}_line_check-${checkDirs}.log`;
        logFile = logFile.replace(/ /g, "_").replace(/\//g, "_");
        const logPath = joinDirectoryPath(`${outputDir}/${logFile}`);
        fs.writeFileSync(
          logPath,
          "Exclude directories: " + excludeDirs + "\n\n"
        );
        fs.appendFileSync(
          logPath,
          "Files with more than " + maxLines + " lines:\n" + "\n"
        );
        outputInfos.forEach((item) => {
          fs.appendFileSync(
            logPath,
            `File: ${item.file} , Lines: ${item.lines}\n`
          );
        });
        fs.appendFileSync(
          logPath,
          "\n" + "Total files: " + outputInfos.length + "\n"
        );
        fs.appendFileSync(logPath, "Check date: " + dateStr + "\n");
      }

      // 退出进程
      process.exit();
    }
  }, duration);
}

function run(dirs = []) {
  // 指定要遍历的目录
  dirs.forEach((checkDir) => {
    checkDirectory(joinDirectoryPath(checkDir));
  });

  // 定时检查是否遍历完成
  const duration = 50;
  regularCheck(duration);
}
