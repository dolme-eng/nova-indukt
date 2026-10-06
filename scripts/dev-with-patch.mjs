/**
 * Runs `next dev` / `next build` with the Windows readlink shim preloaded, and
 * without it on every other platform.
 *
 * Replaces the inline `node -e` one-liner that used to live in package.json for
 * `build:win`, so the same logic also covers `dev` and documents *why* the shim
 * exists in one place (see readlink-patch.cjs).
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

const env = { ...process.env }
const args = [...nextArgs]

if (isWindows) {
  // Turbopack (the default bundler since Next 15) needs to create NTFS junction
  // points inside .next/node_modules, which fails on Windows without elevated
  // privileges ("os error 1"). The previous `build:win` script already forced
  // webpack for that reason — this keeps that behaviour for dev as well.
  args.push('--webpack')

  if (existsSync(patchFile)) {
    const flag = '--require ./readlink-patch.cjs'
    env.NODE_OPTIONS = env.NODE_OPTIONS ? `${env.NODE_OPTIONS} ${flag}` : flag
  } else {
    console.warn('[warn] readlink-patch.cjs not found — building without the Windows shim.')
  }
} else {
  // Outside Windows the shim is unnecessary and would only mask real EISDIR bugs.
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
