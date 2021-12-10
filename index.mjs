#!/usr/bin/env node

import chalk from 'chalk';

import { spawn } from 'child_process';

function showHelp() {
  console.warn(`Usage: typehead [subcommand]

  Refreshingly simple CLI for TypeScript packages.
  
  Options:
    -h, --help           Display help for [subcommand]
  `);
}

if (process.argv.length < 3) {
  showHelp();
  process.exit(1);
}

const subcommand = process.argv[2];
const child = spawn(`typehead-${subcommand}`, process.argv.slice(3));

child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on('error', (e) => {
  if (e.message.includes('ENOENT')) {
    console.warn(
      chalk.yellow(`Couldn't find typehead-${subcommand} in your PATH. ⚠️\n`)
    );
    showHelp();
    process.exit(1);
    return;
  }

  console.error(e);
});
