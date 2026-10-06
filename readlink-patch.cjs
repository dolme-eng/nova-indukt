/**
 * Windows-only workaround, injected via NODE_OPTIONS (see `npm run build:win`
 * and playwright.config.ts).
 *
 * WHY: the repository contains a `_bak_corrupt/` directory whose NTFS entry is
 * damaged — Git cannot stat it ("could not open directory") and `rmdir` fails
 * with "not empty" while listing no children. On Windows, `fs.readlink` on such
 * a path yields EISDIR, whereas the POSIX behaviour Next.js expects is EINVAL.
 * Without this patch, Next 16's file watcher aborts on Windows.
 *
 * This is a mitigation, not a fix: delete `_bak_corrupt/` (possibly with
 * `chkdsk /f E:`) and drop this file along with the NODE_OPTIONS entries.
 *
 * NOTE: it patches `fs` globally for the whole process, which also affects
 * unrelated callers — e.g. `crypto.timingSafeEqual` throws on mismatched buffer
 * lengths, and that error type is not touched here, but future changes to fs
 * semantics reach every dependency in the tree.
 */
const fs = require("fs");

if (!process.env.NOVA_READLINK_PATCH_QUIET) {
  console.error(
    '[PATCH] readlink EISDIR→EINVAL shim active (Windows workaround). ' +
      'See readlink-patch.cjs for the removal condition.'
  );
}

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
