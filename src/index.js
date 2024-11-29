const fs = require("fs");
const path = require("path");
const { joinDirectoryPath, matchExcludeDirectory } = require("./lib/utils");

const outputInfos = [];

// 递归遍历目录
function checkDirectory(directoryPath, formatOptions) {
  const { excludeDirs, maxLines } = formatOptions;
  // 排除指定目录
  if (matchExcludeDirectory(directoryPath, excludeDirs)) {
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
            checkDirectory(filePath, formatOptions);
          }
        }
      });
    });
  });
}

const printLogToConsole = (outputInfos, formatOptions) => {
  const { maxLines, excludeDirs } = formatOptions;

  const dateStr = new Date().toISOString();
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
};

const writeLogToFile = (outputInfos, formatOptions) => {
  const { maxLines, outputDir, excludeDirs, checkDirs } = formatOptions;

  const dateStr = new Date().toISOString();
  // 转义文件名中的空格和斜杠
  let logFile = `${dateStr
    .replaceAll("-", "_")
    .slice(0, 19)}-${maxLines}_line_check-${checkDirs}.log`;
  logFile = logFile.replace(/ /g, "_").replace(/\//g, "_");
  const logPath = joinDirectoryPath(`${outputDir}/${logFile}`);
  fs.writeFileSync(logPath, "Exclude directories: " + excludeDirs + "\n\n");
  fs.appendFileSync(
    logPath,
    "Files with more than " + maxLines + " lines:\n" + "\n"
  );
  outputInfos.forEach((item) => {
    fs.appendFileSync(logPath, `File: ${item.file} , Lines: ${item.lines}\n`);
  });
  fs.appendFileSync(
    logPath,
    "\n" + "Total files: " + outputInfos.length + "\n"
  );
  fs.appendFileSync(logPath, "Check date: " + dateStr + "\n");
};

// 定时检查是否遍历完成
function regularCheck(duration, formatOptions) {
  const { outputDir } = formatOptions;
  let outputCount = 0;
  let checkCount = 0;

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
        printLogToConsole(outputInfos, formatOptions);
      }
      // --------------------------
      // 同时将日志输出到文件
      if (outputDir !== undefined) {
        writeLogToFile(outputInfos, formatOptions);
      }

      // 退出进程
      process.exit();
    }
  }, duration);
}

function run(formatOptions) {
  const { checkDirs } = formatOptions;

  // 指定要遍历的目录
  checkDirs.forEach((checkDir) => {
    checkDirectory(joinDirectoryPath(checkDir), formatOptions);
  });

  // 定时检查是否遍历完成
  const duration = 50;
  regularCheck(duration, formatOptions);
}

function locc(options) {
  const formatOptions = {
    maxLines: options.lines,
    checkDirs: options.directory.split(","),
    outputDir: options.output,
    excludeDirs: options.exclude.split(","),
  };

  run(formatOptions);
}

module.exports = { locc };
