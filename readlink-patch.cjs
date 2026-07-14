const fs = require("fs");

// Patch async readlink
const origReadlink = fs.readlink;
fs.readlink = function(p, cb) {
  if (typeof cb === "function") {
    return origReadlink.call(this, p, function(err, result) {
      if (err && err.code === "EISDIR") {
        const newErr = new Error('EINVAL: invalid argument, readlink \'' + p + '\'');
        newErr.code = "EINVAL";
        newErr.path = p;
        return cb(newErr);
      }
      return cb(err, result);
    });
  }
  return origReadlink.apply(this, arguments);
};

// Patch promise version
const origReadlinkPromises = fs.promises?.readlink;
if (origReadlinkPromises) {
  fs.promises.readlink = function(p, ...args) {
    return origReadlinkPromises.call(this, p, ...args).catch(e => {
      if (e.code === "EISDIR") {
        e.code = "EINVAL";
      }
      throw e;
    });
  };
}

// Patch readlinkSync
const origReadlinkSync = fs.readlinkSync;
fs.readlinkSync = function(p, ...args) {
  try {
    return origReadlinkSync.call(this, p, ...args);
  } catch(e) {
    if (e.code === "EISDIR") {
      const err = new Error('EINVAL: invalid argument, readlink \'' + p + '\'');
      err.code = "EINVAL";
      err.path = p;
      throw err;
    }
    throw e;
  }
};

console.error("[PATCH] All readlink variants patched (PID:", process.pid, ")");
