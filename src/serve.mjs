#!/usr/bin/env node

import * as esbuild from 'esbuild';

import { Command } from 'commander';
import chalk from 'chalk';

import deepmerge from 'deepmerge';
import { resolve } from 'path';

import { getEsbuildConfig } from './util/getEsbuildConfig.mjs';
import { findEntryPoint } from './util/findEntryPoint.mjs';

// Setup command line arguments.
const program = new Command()
  .name('typehead-serve')
  .option('-h --host <host>', 'Host for server (localhost by default).')
  .option('-p --port <port>', 'Port for server (20009 by default).')
  .option('--print-esbuild-config', 'Prints the ESBuild config.')
  .parse(process.argv);
const argv = program.opts();

// Get base ESBuild config.
const config = deepmerge(await getEsbuildConfig(), {
  entryNames: '[dir]/[name]-bundle',
  platform: 'browser',
  format: 'esm',
});

// Either use 'webEntryPoints' from config file or find in web/index.
const cwd = process.cwd();
config.entryPoints = config.webEntryPoints || [
  await findEntryPoint(resolve(cwd, 'web', 'index')),
];
config.outdir = config.webOutdir || 'web';

if (argv.printEsbuildConfig) {
  console.log(chalk.blue('ESBuild config:'));
  console.log(JSON.stringify(config, null, 2));
}

console.log(chalk.blue('Open your browser to build the file! 🏗️'));

const server = await esbuild.serve(
  {
    servedir: 'web',
    host: argv.host || 'localhost',
    // "it will default to an open port with a preference for port 8000"
    // https://esbuild.github.io/api/#serve-arguments
    port: argv.port || undefined,
  },
  config
);

console.log(
  chalk.yellow(`\nServer available at http://${server.host}:${server.port}`)
);
