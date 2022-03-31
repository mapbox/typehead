#!/usr/bin/env node

import * as esbuild from 'esbuild';

import { Command } from 'commander';
import chalk from 'chalk';

import deepmerge from 'deepmerge';
import { resolve } from 'path';

import { getEsbuildConfig } from './util/getEsbuildConfig.mjs';
import { findEntryPoint } from './util/findEntryPoint.mjs';
import { IS_EXTERNAL } from './util/regex.mjs';

// Setup command line arguments.
const program = new Command()
  .name('typehead-build')
  .option('-w --watch', 'Watch source files for changes.')
  .option('--print-esbuild-config', 'Prints the ESBuild config.')
  .parse(process.argv);
const argv = program.opts();

// Get base ESBuild config.
const config = await getEsbuildConfig();

// Make sure we're setting a default entry point and outdir.
if (!config.entryPoints) {
  const cwd = process.cwd();
  config.entryPoints = [await findEntryPoint(resolve(cwd, 'src', 'index'))];
}
if (!config.outdir) {
  config.outdir = 'dist';
}

if (argv.printEsbuildConfig) {
  console.log(chalk.blue('ESBuild config:'));
  console.log(JSON.stringify(config, null, 2));
}

// Configure watch.
if (argv.watch) {
  config.watch = {
    onRebuild(e) {
      if (e) {
        console.error(chalk.red('Rebuild failed. ⚔️'));
        console.error(e);
        return;
      }

      console.log(chalk.green(`Rebuild complete! 🎉`));
    },
  };

  console.log(chalk.blue('Watching filesystem for changes...'));
}

// Get the time so we can show how long it took to build.
const now1 = Date.now();
console.log(chalk.blue('Build starting! 🏗️'));

// 'pkgConfig' includes make-all-packages-external, which for NPM
// distribution is what we want.
const pkgConfig = deepmerge(config, {
  plugins: [
    /**
     * Small ESBuild plugin not to bundle node_modules:
     * https://github.com/evanw/esbuild/issues/619#issuecomment-751995294
     */
    {
      name: 'make-all-packages-external',
      setup(build) {
        build.onResolve({ filter: IS_EXTERNAL }, (args) => ({
          path: args.path,
          external: true,
        }));
      },
    },
  ],
});

try {
  await Promise.all([
    // Development build.
    esbuild.build({
      ...pkgConfig,
      entryNames: '[dir]/[name]-development',
      format: 'cjs',
    }),
    // Production build.
    esbuild.build({
      ...pkgConfig,
      entryNames: '[dir]/[name]',
      format: 'cjs',
      minify: true,
    }),
    // ESM build.
    esbuild.build({
      ...pkgConfig,
      entryNames: '[dir]/[name]-esm',
      format: 'esm',
    }),
  ]);
} catch (e) {
  console.error(chalk.red('Build failed. ⚔️'));
  console.error(e);
}

// If we have a global name, create a build for CDN.
if (config.globalName) {
  try {
    await Promise.all([
      // CDN build.
      esbuild.build({
        ...config,
        entryNames: `[dir]/${config.globalName}`,
        format: 'iife',
        minify: true,
      }),
    ]);
  } catch (e) {
    console.error(chalk.red('Build failed. ⚔️'));
    console.error(e);
  }
}

const now2 = Date.now();
console.log(chalk.green(`Build complete in ${(now2 - now1) / 1000}s 🎉`));
