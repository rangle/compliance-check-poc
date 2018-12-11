import { isTax } from "./policy-rules";
describe("the policy rules", () => {
  describe("isTax", () => {
    it("should accept a string of upto 9 numbers", () => {
      const input = "123456789";
      const result = isTax(input);
      expect(result).toBe(true);
    });
    it("should accept dashes between 3/4 and 5/6 numbers",()=>{
        const input = "123-45-6789";
        const result = isTax(input);
        expect(result).toBe(true);
    });
    it('should not accept non-numeric values',()=>{
        const input = "AAA-45-6789";
        const result = isTax(input);
        expect(result).toBe(false);
    });
    it('should not accept numbers longer than 9',()=>{
        const input = "1234567890";
        const result = isTax(input);
        expect(result).toBe(false);

    })
    it('should not accept numbers shorter than 9',()=>{
        const input = "1234567890";
        const result = isTax(input);
        expect(result).toBe(false);
    });
    it('should not accept dashes in other locations',()=>{
        const input = "1-2345678-9";
        const result = isTax(input);
        expect(result).toBe(false);
    })
  });
});
