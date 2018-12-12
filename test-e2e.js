#!/usr/bin/env node

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { checkCompliance } = require('./build/commonjs/');

const baseDir = join(__dirname, 'test-cases');
const dirs = readdirSync(baseDir);

let exitFlag = 0;

dirs.forEach(dir => {
  const input = readFileSync(join(baseDir, dir, 'input.json'), {
    encoding: 'utf8'
  });
  const expected = readFileSync(join(baseDir, dir, 'expected.json'), {
    encoding: 'utf8'
  });

  // make sure to use the exact same stringification for testing
  const reParsedExpected = JSON.stringify(JSON.parse(JSON.stringify(expected)));
  const results = JSON.stringify(checkCompliance(input));

  if (reParsedExpected === results) {
    console.log(dir + ' Passed');
  } else {
    console.log(dir + ' Failed');
    exitFlag += 1;
  }
});

process.exit(exitFlag);
