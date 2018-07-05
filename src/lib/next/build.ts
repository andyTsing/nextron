import { execSync } from 'child_process'
import { join, sep } from 'path'
import { copy, remove, readFileSync, writeFileSync } from 'fs-extra'
import * as fg from 'fast-glob'
import resolveExportedPaths from './resolve-exported-paths'

export default async function build(rendererDir: string): Promise<void> {
  const cwd: string = process.cwd()
  const outdir: string = join(cwd, rendererDir, 'out')
  const appdir: string = join(cwd, 'app')
  execSync(`node_modules${sep}.bin${sep}next build ${rendererDir}`, { cwd })
  execSync(`node_modules${sep}.bin${sep}next export ${rendererDir}`, { cwd })
  await copy(outdir, appdir)
  await remove(outdir)

  const pages: string[] = fg.sync(join(appdir, '**/*.html'))
  pages.forEach(page => {
  	writeFileSync(page, resolveExportedPaths(readFileSync(page).toString()))
  })
}