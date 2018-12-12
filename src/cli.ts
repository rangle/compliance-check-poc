import { checkCompliance } from './policy-check';
import { readFileSync } from 'fs';

if (!process.argv[2]) {
  console.log(`Usage: ${process.argv[1]} /path/to/input.json`);
  process.exit(1);
}

try {
  const file = readFileSync(process.argv[2], { encoding: 'utf8' });

  // pretty print the results
  console.log(JSON.stringify(checkCompliance(JSON.parse(file)), null, 4));
} catch (err) {
  console.log('Error validating input ' + err.message);
  process.exit(2);
}
