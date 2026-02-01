import path from "node:path";

// 拼接目录路径
function joinDirectoryPath(subPath) {
  return path.join(process.cwd(), subPath);
}

// 匹配排除的目录
function matchExcludeDirectory(directoryPath, excludeDirs) {
  if (!Array.isArray(excludeDirs)) {
    return false;
  }

  const excluded = excludeDirs.some((dir) =>
    directoryPath.split(path.posix.sep).includes(dir)
  );

  return excluded;
}

export { joinDirectoryPath, matchExcludeDirectory };
