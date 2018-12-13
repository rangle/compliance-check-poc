import {
  ComplianceDocument,
  ComplianceOutput,
  ComplianceRule,
  Validator
} from './interfaces';
import { rules as defaultRules } from './policy-rules';

export function checkCompliance(
  input: ComplianceDocument,
  rules: ComplianceRule[] = defaultRules
): ComplianceOutput {
  const doc = rules.reduce(
    (acc: ComplianceOutput, rule: any) => {
      const validators = Array.isArray(rule.predicate)
        ? rule.predicate
        : [rule.predicate];

      const prop = getProp(input, rule.path);
      const isValid = validateProp(prop, validators, input);

      if (!isValid) {
        return {
          ...acc,
          requirements: [...acc.requirements, rule.path.join('.')]
        };
      }
      return acc;
    },
    {
      compliant: false,
      requirements: []
    }
  );

  doc.compliant = doc.requirements.length === 0;
  return doc;
}

export function getProp(
  dictionary: { [key: string]: any },
  path: string[]
): any {
  if (path.length === 0) {
    throw new TypeError(
      'invalid path, paths must be string[] with a length > 0'
    );
  }

  const parentProp = dictionary[path[0]];

  if (path.length === 1) {
    return parentProp;
  }

  // if the path does not exist return falsey
  if (!parentProp) {
    return parentProp;
  }

  return getProp(parentProp, path.slice(1));
}

export function validateProp(
  prop: any,
  validators: Validator[],
  doc: ComplianceDocument
) {
  // run the validator until one of the predicates fails
  return validators.reduce(
    (result, validator) => (result ? validator(prop, doc) : false),
    true
  );
}
