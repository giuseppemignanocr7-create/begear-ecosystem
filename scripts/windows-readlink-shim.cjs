const fs = require("node:fs");
const path = require("node:path");

const originalReadlink = fs.readlink;
const originalReadlinkSync = fs.readlinkSync;
const originalPromisesReadlink = fs.promises.readlink.bind(fs.promises);
const originalLstatSync = fs.lstatSync;

function isRegularPath(targetPath) {
  try {
    const stats = originalLstatSync(targetPath);
    return !stats.isSymbolicLink();
  } catch {
    return false;
  }
}

function normalizeReadlinkError(error, targetPath) {
  if (error && error.code === "EISDIR" && isRegularPath(targetPath)) {
    const normalizedError = new Error(
      `EINVAL: invalid argument, readlink '${path.resolve(String(targetPath))}'`,
    );
    normalizedError.code = "EINVAL";
    normalizedError.errno = error.errno;
    normalizedError.syscall = error.syscall;
    normalizedError.path = error.path;
    return normalizedError;
  }

  return error;
}

fs.readlink = function patchedReadlink(targetPath, options, callback) {
  if (typeof options === "function") {
    return originalReadlink.call(fs, targetPath, (error, result) => {
      options(normalizeReadlinkError(error, targetPath), result);
    });
  }

  return originalReadlink.call(fs, targetPath, options, (error, result) => {
    callback(normalizeReadlinkError(error, targetPath), result);
  });
};

fs.readlinkSync = function patchedReadlinkSync(targetPath, options) {
  try {
    return originalReadlinkSync.call(fs, targetPath, options);
  } catch (error) {
    throw normalizeReadlinkError(error, targetPath);
  }
};

fs.promises.readlink = async function patchedPromisesReadlink(targetPath, options) {
  try {
    return await originalPromisesReadlink(targetPath, options);
  } catch (error) {
    throw normalizeReadlinkError(error, targetPath);
  }
};
