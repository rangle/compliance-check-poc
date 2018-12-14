import { readFileSync, writeFileSync } from 'fs';
import { submitDocument as submit } from './compliance-state';
export { checkCompliance } from './policy-check';

export const submitDocument = submit(readFileSync, writeFileSync);
