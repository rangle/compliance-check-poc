import R from 'ramda';

export const isEmpty = value => R.isNil(value) || R.isEmpty(value);
export const isBetween = (min, max) => value => {
  return value >= min && value <= max;
};

export const isString = value => !isEmpty(value) && R.is(String, value);
// eslint-disable-next-line no-useless-escape
export const isTax = value => /^\d{9}\b|\d{3}\-{1}\d{2}\-{1}\d{4}\b/.test(value);