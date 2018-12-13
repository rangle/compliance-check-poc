import { ComplianceDocument, Validator } from './interfaces';

const defaultCountries = ['US', 'GB', 'CA', 'AT'];

export const isAlphaNumeric: Validator = (input: any) => {
  // NOTE space counts as alphanumeric based on the given test cases
  return /^[a-z 0-9]+$/i.test(input);
};

export const isBetween: (min: number, max: number) => Validator = (
  min: number,
  max: number
) => (value: any) => {
  return value >= min && value <= max;
};

export const isEmpty: Validator = (value: any) => (value ? false : true);

export const isString: Validator = (value: any) =>
  !isEmpty(value) && typeof value === 'string';

export const isStringLengthBetween: (min: number, max: number) => Validator = (
  min: number,
  max: number
) => (value: any) => isString(value) && isBetween(min, max)(value.length);

export const isTax: Validator = (value: any) => {
  return isString(value) && /^\d{9}\b|\d{3}\-{1}\d{2}\-{1}\d{4}\b/.test(value);
};

export const isTruthy: Validator = (input: any): boolean =>
  input ? true : false;

export const isValidCountry: (countries?: string[]) => Validator = (
  countries: string[] = defaultCountries
) => (input: any) => {
  return countries.indexOf(input) > -1;
};

export const isValidState: (
  countriesWithStates?: string[],
  countries?: string[]
) => Validator = (
  countriesWithStates: string[] = ['CA', 'US'],
  countries: string[] = defaultCountries
) => (input: any, doc?: ComplianceDocument) => {
  if (!doc || !doc.address) {
    // if there is no address then the state is technically valid
    return true;
  }

  if (!isValidCountry(countries)(doc.address.country)) {
    // if country is empty or invalid return true
    return true;
  }

  if (countriesWithStates.indexOf(doc.address.country) > -1) {
    return isString(input);
  } else {
    // assumes that "null" counts as being present
    return input === undefined ? true : false;
  }
};

// could use composition here instead
export const isValidPostalCode: Validator = (input: any) => {
  return isStringLengthBetween(5, 10)(input) && isAlphaNumeric(input);
};
