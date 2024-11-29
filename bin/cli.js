#!/usr/bin/env node

const { program } = require("commander");
const pkg = require("../package.json");
const { locc } = require("../src/index.js");

program
  .version(pkg.version)
  .description("Check files in a directory for exceeding a line threshold")
  .usage("[options] <directory> [output]")
  .option(
    "-l, --lines <number>",
    "Set the line threshold (default is 200 lines)",
    200
  )
  .option(
    "-d, --directory <paths>",
    "Specify the directories to check, separated by commas (default is the current directory)",
    "./"
  )
  .option(
    "-o, --output <path>",
    "Output the log to a specified directory (default is output to the console)"
  )
  .option(
    "-e --exclude <paths>",
    "Specify the directories to exclude, separated by commas (default is .git and node_modules)",
    ".git,node_modules"
  );

program.addHelpText(
  "after",
  [
    "\nExample call:",
    "  $ locc",
    "  $ locc -l 200",
    "  $ locc -l 200 -d path/to/directory",
    "  $ locc -l 200 -d path/to/directory -o path/to/output",
    "  $ locc -l 200 -d path/to/directory1,path/to/directory2 -o path/to/output",
  ].join("\n")
);

program.parse(process.argv);

const options = program.opts();

locc(options);
