import {
  isBetween,
  isEmpty,
  isString,
  isTax,
  isTruthy,
  isValidCountry,
  isStringLengthBetween,
  isValidState,
  isAlphaNumeric,
  isValidPostalCode
} from './validators';

describe('the policy rules', () => {
  describe('isAlphaNumeric', () => {
    it('returns true if the string has only letters and numbers', () => {
      expect(isAlphaNumeric('abcABC123')).toBe(true);
    });

    it('returns true if there is a space', () => {
      expect(isAlphaNumeric('abcAB 123')).toBe(true);
    });

    it('returns false if there is a dash', () => {
      expect(isAlphaNumeric('abcAB-123')).toBe(false);
    });

    it('returns false if there is a random symbol', () => {
      expect(isAlphaNumeric('abcABC%123')).toBe(false);
    });
  });
  describe('isBetween', () => {
    it('returns true if a value is in the range', () => {
      expect(isBetween(3, 7)(5)).toBe(true);
    });

    it('is inclusive to the minimum', () => {
      expect(isBetween(0, 5)(0)).toBe(true);
    });

    it('is inclusive to the maximum', () => {
      expect(isBetween(0, 5)(5)).toBe(true);
    });

    it('returns false for high values', () => {
      expect(isBetween(0, 5)(7)).toBe(false);
    });

    it('returns false for low values', () => {
      expect(isBetween(0, 5)(-1)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('returns false for a non-empty value', () => {
      expect(isEmpty(7)).toBe(false);
    });
    it('returns true for undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('returns true for ""', () => {
      expect(isEmpty('')).toBe(true);
    });
  });

  describe('isString', () => {
    it('returns false for empty strings', () => {
      expect(isString('')).toBe(false);
    });

    it('returns false for non-strings', () => {
      expect(isString(7)).toBe(false);
    });

    it('returns true for non-empty strings', () => {
      expect(isString('foo')).toBe(true);
    });
  });

  describe('isStringLengthBetween', () => {
    it('returns true if the length of a string is between given numbers', () => {
      expect(isStringLengthBetween(5, 10)('123456')).toBe(true);
    });

    it('returns false if a given string is too short', () => {
      expect(isStringLengthBetween(5, 10)('1234')).toBe(false);
    });

    it('returns false if a given string is too long', () => {
      expect(isStringLengthBetween(5, 10)('12345678911')).toBe(false);
    });
  });

  describe('isTax', () => {
    it('does not accept numbers', () => {
      const input = 123456789;
      const result = isTax(input);
      expect(result).toBe(false);
    });

    it('accepts a string of upto 9 numbers', () => {
      const input = '123456789';
      const result = isTax(input);
      expect(result).toBe(true);
    });

    it('accept dashes between 3/4 and 5/6 numbers', () => {
      const input = '123-45-6789';
      const result = isTax(input);
      expect(result).toBe(true);
    });

    it('does not accept non-numeric values', () => {
      const input = 'AAA-45-6789';
      const result = isTax(input);
      expect(result).toBe(false);
    });

    it('does not accept numbers longer than 9', () => {
      const input = '1234567890';
      const result = isTax(input);
      expect(result).toBe(false);
    });

    it('does not accept numbers shorter than 9', () => {
      const input = '1234567890';
      const result = isTax(input);
      expect(result).toBe(false);
    });

    it('does not accept dashes in other locations', () => {
      const input = '1-2345678-9';
      const result = isTax(input);
      expect(result).toBe(false);
    });
  });

  describe('isTruthy', () => {
    it('returns false for null', () => {
      expect(isTruthy(null)).toBe(false);
    });

    it('returns false for undefined', () => {
      expect(isTruthy(undefined)).toBe(false);
    });

    it('returns false for 0', () => {
      expect(isTruthy(0)).toBe(false);
    });

    it('returns true for a POJO', () => {
      expect(isTruthy({})).toBe(true);
    });
  });

  describe('isValidCountry', () => {
    it('returns true if an item is in a given list', () => {
      expect(isValidCountry(['CA', 'US', 'GB'])('GB')).toBe(true);
    });

    it('retruns false if an item is not in a given list', () => {
      expect(isValidCountry(['CA', 'US', 'GB'])('FR')).toBe(false);
    });

    it('has a default list of countries built in', () => {
      expect(isValidCountry()('GB')).toBe(true);
    });
  });

  describe('isValidPostalCode', () => {
    it('must be at least five characters', () => {
      expect(isValidPostalCode('ABCDE')).toBe(true);
    });

    it('must be no more than ten characters', () => {
      expect(isValidPostalCode('ABCDEFGHIJK')).toBe(false);
    });

    it('must be alphanumeric', () => {
      expect(isValidPostalCode('ABC-DEF')).toBe(false);
    });

    it('should work on a real use case', () => {
      expect(isValidPostalCode('90210')).toBe(true);
    });
  });

  describe('isValidState', () => {
    it('provides default countries and countriesWithStates', () => {
      expect(isValidState()('CA')).toBe(true);
    });

    it(
      'returns true if a state field is not present and country is malformed on ' +
        'compliance doc',
      () => {
        expect(
          isValidState(['CA', 'US'], ['CA', 'GB', 'US'])(undefined, {
            address: {}
          })
        ).toBe(true);
      }
    );

    it(
      'returns true if a state field is present and country is malformed on ' +
        'compliance doc',
      () => {
        expect(
          isValidState(['CA', 'US'], ['CA', 'GB', 'US'])('ON', {
            address: {}
          })
        ).toBe(true);
      }
    );

    it(
      'returns false if a state field is not present but the country ' +
        'has states',
      () => {
        expect(
          isValidState(['CA', 'US'], ['CA', 'GB', 'US'])(undefined, {
            address: { country: 'CA' }
          })
        ).toBe(false);
      }
    );

    it(
      'returns false if a state field is present but the country ' +
        'has no states',
      () => {
        expect(
          isValidState(['CA', 'US'], ['CA', 'GB', 'US'])('EX', {
            address: { country: 'GB' }
          })
        ).toBe(false);
      }
    );

    it('returns true if a state field is present and the country has states', () => {
      expect(
        isValidState(['CA', 'US'], ['CA', 'GB', 'US'])('ON', {
          address: { country: 'CA' }
        })
      ).toBe(true);
    });

    it('returns true if a state field is absent and the country has no states', () => {
      expect(
        isValidState(['CA', 'US'], ['CA', 'GB', 'US'])(undefined, {
          address: { country: 'GB' }
        })
      ).toBe(true);
    });

    // impossible case
    it('returns true if a document is not provided', () => {
      expect(isValidState(['CA', 'US'], ['CA', 'GB', 'US'])('ON')).toBe(true);
    });

    // impossible case
    it('returns true if a document has no address object', () => {
      expect(isValidState(['CA', 'US'], ['CA', 'GB', 'US'])('ON')).toBe(true);
    });
  });
});
