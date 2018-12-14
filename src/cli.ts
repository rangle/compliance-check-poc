import { checkCompliance } from './policy-check';
import { submitDocument } from './compliance-state';

export function main(
  argv: any[],
  exit: (code: number) => any,
  readFileSync: (path: string, encoding: any) => string,
  writeFileSync: (path: string, data: any, encoding: any) => any
) {
  if (argv[2] !== 'check' && argv[2] !== 'submit') {
    console.log(`Usage: ${argv[1]} check /path/to/input.json`);
    console.log(`Usage: ${argv[1]} submit /path/to/input.json`);
    exit(1);
  }

  if (!argv[3]) {
    console.log(`Usage: ${argv[1]} check /path/to/input.json`);
    console.log(`Usage: ${argv[1]} submit /path/to/input.json`);
    exit(1);
  }

  try {
    const file = readFileSync(argv[3], { encoding: 'utf8' });

    // pretty print the results
    if (argv[2] === 'check') {
      console.log(JSON.stringify(checkCompliance(JSON.parse(file)), null, 4));
    } else {
      console.log(JSON.stringify(submitDocument(
        readFileSync,
        writeFileSync
      )(JSON.parse(file)), null, 4));
    }
  } catch (err) {
    console.log('Error validating input ' + err.message);
    exit(2);
  }
}
