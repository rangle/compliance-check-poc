import { add } from './example';

describe('example', () => {
  it('adds numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
