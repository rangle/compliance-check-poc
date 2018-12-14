#!/usr/bin/env node

const { readdirSync, readFileSync } = require('fs');
const { join } = require('path');
const { checkCompliance } = require('./build/commonjs/');

const baseDir = join(__dirname, 'test-cases');
const dirs = readdirSync(baseDir);

let exitFlag = 0;

dirs.forEach(dir => {
  try {
    const input = JSON.parse(
      readFileSync(join(baseDir, dir, 'input.json'), {
        encoding: 'utf8'
      })
    );
    const expected = JSON.parse(
      readFileSync(join(baseDir, dir, 'expected.json'), {
        encoding: 'utf8'
      })
    );

    // make sure to use the exact same stringification for testing
    const reParsedExpected = JSON.stringify(expected);
    const results = JSON.stringify(checkCompliance(input));

    if (reParsedExpected === results) {
      console.log(dir + ' Passed');
    } else {
      console.log(dir + ' Failed');
      if (process.env.debug) {
        console.log('**   GIVEN  **', results);
        console.log('');
        console.log('** EXPECTED **', reParsedExpected);
        console.log('');
        console.log('');
      }
      exitFlag += 1;
    }
  } catch (err) {
    console.log('Error loading/parsing test: ' + dir + ' ' + err.message);
    exitFlag += 1;
  }
});

if (exitFlag) {
  console.log('Warning: Some tests failed');
}
process.exit(exitFlag);
