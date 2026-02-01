import fs from "node:fs";
import path from "node:path";
import { joinDirectoryPath, matchExcludeDirectory } from "./lib/utils";

const fileList = [];
const taskList = [];
const outputInfos = [];

// 创建读取文件的任务
function createReadFileTask(filePath, maxLines) {
  return new Promise((resolve, reject) => {
    // 读取文件内容
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        reject(err);
        return console.error("Unable to read file: " + err);
      }
      // 计算文件行数
      const lines = data.split("\n").length;
      // 如果行数大于 maxLines 行，输出文件名和路径
      if (lines > maxLines) {
        // console.log(`File: ${filePath}, Lines: ${lines}`);
        resolve({
          file: filePath,
          lines: lines,
        });
      } else {
        resolve(null);
      }
    });
  });
}

// 递归遍历目录
function checkDirectory(directoryPath, formatOptions) {
  try {
    const { maxLines, excludeDirs } = formatOptions;
    // 排除指定目录
    if (matchExcludeDirectory(directoryPath, excludeDirs)) {
      return;
    }

    // console.log(`Scanning directory: ${directoryPath}`);

    // 读取目录内容
    const files = fs.readdirSync(directoryPath);

    // 遍历目录中的每个文件
    files.forEach((file) => {
      // console.log(`Checking file: ${file}`);
      const filePath = path.join(directoryPath, file);

      // 检查是否为文件
      const stats = fs.statSync(filePath);

      if (stats.isFile()) {
        fileList.push(filePath);
        // 如果是文件，创建读取文件的任务
        taskList.push(createReadFileTask(filePath, maxLines));
      } else {
        // 如果是目录，递归调用 checkDirectory
        if (stats.isDirectory()) {
          checkDirectory(filePath, formatOptions);
        }
      }
    });
  } catch (err) {
    console.error("Unable to scan directory: " + err);
  }
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

const handleOutputInfos = (outputInfos, formatOptions) => {
  const { outputDir } = formatOptions;

  if (outputDir === undefined) {
    printLogToConsole(outputInfos, formatOptions);
  }
  // --------------------------
  // 同时将日志输出到文件
  if (outputDir !== undefined) {
    writeLogToFile(outputInfos, formatOptions);
  }
};

async function run(formatOptions) {
  // console.log("formatOptions", formatOptions);
  const { checkDirs } = formatOptions;
  // console.log("Start scanning...");

  // 指定要遍历的目录
  checkDirs.forEach((checkDir) => {
    checkDirectory(joinDirectoryPath(checkDir), formatOptions);
    // console.log("taskList", taskList.length, taskList);
    console.log("Scanning... " + taskList.length + " files found");
  });
  // console.log("fileList", fileList.length, fileList);

  // 并行执行所有任务
  await Promise.all(taskList)
    .then((results) => {
      // console.log("Results: ", results);
      // 过滤掉 null 值
      const validResults = results.filter((item) => item !== null);
      // console.log("Valid results: ", validResults);
      outputInfos.push(...validResults);
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
  // console.log("outputInfos", outputInfos.length, outputInfos);

  console.log("Scan completed");
  handleOutputInfos(outputInfos, formatOptions);

  // 退出进程
  process.exit();
}

async function locc(options) {
  const formatOptions = {
    maxLines: options.lines,
    checkDirs: options.directory.split(","),
    outputDir: options.output,
    excludeDirs: options.exclude.split(","),
  };

  await run(formatOptions);
}

export { locc };
