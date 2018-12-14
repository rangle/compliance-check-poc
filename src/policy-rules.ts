import { ComplianceRule } from './interfaces';
import {
  isString,
  isTruthy,
  isStringLengthBetween,
  isValidState,
  isTax,
  isValidCountry,
  isValidPostalCode
} from './validators';

const firstName = ['first_name'];
const lastName = ['last_name'];
const id = ['id'];
const taxId = ['tax_id'];
const addressCountry = ['address', 'country'];
const addressStreet = ['address', 'street'];
const addressCity = ['address', 'city'];
const addressPostalCode = ['address', 'postal_code'];
const addressState = ['address', 'state'];

export const rules: ComplianceRule[] = [
  {
    path: firstName,
    predicate: isString
  },
  {
    path: lastName,
    predicate: isString
  },
  {
    path: id,
    predicate: isString
  },
  {
    path: taxId,
    predicate: isTax
  },
  {
    path: addressStreet,
    predicate: isString
  },
  {
    path: addressCity,
    predicate: isString
  },
  {
    path: addressState,
    predicate: isValidState()
  },
  {
    path: addressPostalCode,
    predicate: isValidPostalCode
  },
  {
    path: addressCountry,
    predicate: isValidCountry()
  }
];
