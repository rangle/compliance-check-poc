import { checkCompliance, getProp, validateProp } from './policy-check';
import { isString, isBetween, isTruthy } from './validators';

const isNumber = (thing: any) => typeof thing === 'number';

describe('policy checking functions', () => {
  describe('checkCompliance', () => {
    it('returns a non-compliant result for an empty doc', () => {
      const rules = [{ path: ['name'], predicate: isString }];
      const result = checkCompliance({}, rules);

      expect(result).toEqual({ compliant: false, requirements: ['name'] });
    });

    it('returns a compliant result for a well formed doc', () => {
      const rules = [{ path: ['name'], predicate: isString }];
      const result = checkCompliance({ name: 'foo' }, rules);

      expect(result).toEqual({ compliant: true, requirements: [] });
    });

    it('handles predicates that are in lists', () => {
      const rules = [{ path: ['name'], predicate: [isString, isTruthy] }];
      const result = checkCompliance({ name: 'foo' }, rules);

      expect(result).toEqual({ compliant: true, requirements: [] });
    });

    it('automatically uses the rules from "policy-rules.ts"', () => {
      const result = checkCompliance({});

      expect(result.compliant).toBe(false);
    });
  });

  describe('getProp', () => {
    it('throws if given a path array of length 0', () => {
      expect(() => getProp({}, [])).toThrow(TypeError);
    });

    it('gets a top level prop', () => {
      expect(getProp({ foo: 7 }, ['foo'])).toBe(7);
    });

    it('gets a nested prop', () => {
      expect(getProp({ foo: { bar: { baz: 5 } } }, ['foo', 'bar', 'baz'])).toBe(
        5
      );
    });

    it('returns undefined if a top level path is not found', () => {
      expect(getProp({}, ['foo'])).toBe(undefined);
    });

    it('returns undefined if a nested level path is not found', () => {
      expect(getProp({}, ['foo', 'bar'])).toBe(undefined);
    });
  });

  describe('validateProp', () => {
    it('returns false if the validator fails', () => {
      expect(validateProp(7, [isString], {})).toBe(false);
    });

    it('returns false if any validator fails', () => {
      expect(validateProp(7, [isString, isNumber], {})).toBe(false);
    });

    it('returns true if all validators succeed', () => {
      expect(
        validateProp(
          7,
          [(input: any) => typeof input === 'number', isBetween(0, 10)],
          {}
        )
      ).toBe(true);
    });
  });
});
