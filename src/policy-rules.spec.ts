import { rules } from './policy-rules';

describe('policy rules', () => {
  it('ships with default rules', () => {
    expect(Array.isArray(rules)).toBe(true);
  });

  /**
   * write some acutal tests if/when the rule descriptions include logic
   */
});
