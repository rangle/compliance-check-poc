import R from 'ramda';

export const isEmpty = value => R.isNil(value) || R.isEmpty(value);
export const isBetween = (min, max) => value => {
  return value >= min && value <= max;
};

export const isString = value => !isEmpty(value) && R.is(String, value);