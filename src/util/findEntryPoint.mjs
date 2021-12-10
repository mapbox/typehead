import chalk from 'chalk';
import { access } from 'fs/promises';

/**
 * Find the entry point with a suitable extension.
 */
export async function findEntryPoint(
  filename,
  extensions = ['.tsx', '.ts', '.jsx', '.js']
) {
  for (const ext of extensions) {
    try {
      // Will throw error if not found.
      await access(filename + ext);
      return filename + ext;
      // eslint-disable-next-line no-empty
    } catch {}
  }

  console.error(
    chalk.red(
      `Couldn't find ${filename}! Alternatively, specify 'entryPoints' in typehead.config.js / your Typehead configuration.\n\nReference: https://github.com/mapbox/typehead#customization\nESBuild Reference: https://esbuild.github.io/api/#entry-points`
    )
  );
  process.exit(1);
}
