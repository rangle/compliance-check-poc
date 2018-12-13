import { checkCompliance } from './policy-check';

export function main(
  argv: any[],
  exit: (code: number) => any,
  readFileSync: (path: string, encoding: any) => string
) {
  if (!argv[2]) {
    console.log(`Usage: ${argv[1]} /path/to/input.json`);
    exit(1);
  }

  try {
    const file = readFileSync(argv[2], { encoding: 'utf8' });

    // pretty print the results
    console.log(JSON.stringify(checkCompliance(JSON.parse(file)), null, 4));
  } catch (err) {
    console.log('Error validating input ' + err.message);
    exit(2);
  }
}
