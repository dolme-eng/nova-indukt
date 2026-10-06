/**
 * Runs `next dev` / `next build` on Windows.
 *
 * Two exFAT limitations on the dev volume are worked around, both documented in
 * readlink-patch.cjs:
 *   1. `fs.readlink*` returns EISDIR on regular files → shim preloaded via
 *      NODE_OPTIONS.
 *   2. Turbopack needs NTFS junction points, which exFAT cannot create → force
 *      webpack.
 *
 * Neither applies on Linux/macOS, where the script passes through untouched.
 *
 * Usage: node scripts/dev-with-patch.mjs <dev|build>
 */
import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const patchFile = path.join(root, 'readlink-patch.cjs')

const command = process.argv[2] ?? 'dev'
const nextArgs = { dev: ['dev'], build: ['build'] }[command]

if (!nextArgs) {
  console.error(`Unknown command "${command}". Expected "dev" or "build".`)
  process.exit(1)
}

const isWindows = process.platform === 'win32'
const args = [...nextArgs]
const env = { ...process.env }

if (isWindows) {
  args.push('--webpack')
  if (existsSync(patchFile)) {
    const flag = '--require ./readlink-patch.cjs'
    env.NODE_OPTIONS = env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ${flag}` : flag
  } else {
    console.warn('[warn] readlink-patch.cjs missing — build may fail on exFAT volumes.')
  }
} else {
  // The shim would only mask real EISDIR errors on a normal filesystem.
  delete env.NODE_OPTIONS
}

const child = spawn('npx', ['next', ...args], {
  cwd: root,
  stdio: 'inherit',
  env,
  shell: isWindows,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }
  process.exit(code ?? 0)
})

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => child.kill(sig))
}
