/**
 * Windows + exFAT shim.
 *
 * The dev volume holding `E:\` is exFAT, where `fs.readlink*` always fails
 * with `EISDIR` — even on a regular file (reproduced on
 * `app/api/addresses/route.ts`). Webpack calls readlink to resolve its module
 * graph, so without this the build fails with:
 *
 *   Error: EISDIR: illegal operation on a directory, readlink '...\route.ts'
 *
 * Linux returns EINVAL there, which is what webpack expects, so we translate.
 *
 * This is a property of the development filesystem, not of the repository:
 * the Vercel build runs on ext4 and never loads this file.
 *
 * Loaded via NODE_OPTIONS by `scripts/dev-with-patch.mjs` and
 * `playwright.config.ts`, and only on win32.
 */
const fs = require('fs')

const translate = (err, p) => {
  if (err && err.code === 'EISDIR') {
    const next = new Error(`EINVAL: invalid argument, readlink '${p}'`)
    next.code = 'EINVAL'
    next.path = p
    return next
  }
  return err
}

const origReadlink = fs.readlink
fs.readlink = function (p, ...args) {
  if (typeof args[0] === 'function') {
    const cb = args[0]
    return origReadlink.call(this, p, (err, result) => cb(translate(err, p), result))
  }
  try {
    return origReadlink.call(this, p, ...args)
  } catch (err) {
    throw translate(err, p)
  }
}

const origPromises = fs.promises?.readlink
if (origPromises) {
  fs.promises.readlink = function (p, ...args) {
    return origPromises.call(this, p, ...args).catch((err) => {
      throw translate(err, p)
    })
  }
}

const origSync = fs.readlinkSync
fs.readlinkSync = function (p, ...args) {
  try {
    return origSync.call(this, p, ...args)
  } catch (err) {
    throw translate(err, p)
  }
}
