import * as R from "ramda";

const firstName = ["first_name"];
const lastName = ["last_name"];
const dobDay = ["dob", "day"];
const dobMonth = ["dob", "month"];
const dobYear = ["dob", "year"];
const id = ["id"];
const taxId = ["tax_id"];
const addressCountry = ["address", "country"];
const addressStreet = ["address", "street"];
const addressCity = ["address", "city"];
const addressPostalCode = ["address", "postal_code"];
const addressState = ["address", "state"];

const isEmpty = value => R.isNil(value) || R.isEmpty(value);
const isBetween = (min, max) => value => {
  return value >= min && value <= max;
};

export const isString = value => !isEmpty(value) && R.is(String, value);

const rules = [
  {
    path: firstName,
    predicate: [isString]
  },
  {
    path: lastName,
    predicate: () => [isString]
  },
  {
    path: dobDay,
    predicate: [isBetween(0, 32)]
  },
  {
    path: dobMonth,
    predicate: [isBetween(0, 13)]
  },
  {
    path: dobYear,
    predicate: [isBetween(1900, 2001)]
  },
  {
    path: id,
    predicate: () => true
  },
  {
    path: taxId,
    predicate: () => true
  },
  {
    path: addressCountry,
    predicate: () => true
  },
  {
    path: addressStreet,
    predicate: () => true
  },
  {
    path: addressCity,
    predicate: () => true
  },
  {
    path: addressPostalCode,
    predicate: () => true
  },
  {
    path: addressState,
    predicate: () => true
  }
];

export const check = policy => value => {
  let document = policy.reduce(
    (acc, rule) => {
      const rules = R.is(Array, rule.predicate)
        ? rule.predicate
        : [rule.predicate];
      const isValid = R.pathSatisfies(n => R.allPass(rules)(n), rule.path)(
        value
      );
      if (!isValid) {
        return {
          ...acc,
          requirements: [...acc.requirements, rule.path.join(".")]
        };
      }
      return acc;
    },
    {
      compliant: undefined,
      requirements: []
    }
  );
  document.compliant = document.requirements.length === 0;
  return document;
};

export const checkDefaultRules = check(rules);
