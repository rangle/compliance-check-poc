import { checkDefaultRules, check } from "./policy-check";
import { isString, isBetween } from './policy-rules';

describe("the policy check", () => {
  it("should not be compliant if a value with isString is empty", () => {
    const policy = [
      {
        path: ["id"],
        predicate: [isString]
      }
    ];
    const document = {
      id: ""
    };

    const result = check(policy)(document);
    expect(result.requirements.length).toBeGreaterThanOrEqual(1);
    expect(result.requirements).toEqual(["id"]);
  });

  it("should  be compliant if a value with isString is empty", () => {
    const policy = [
      {
        path: ["id"],
        predicate: [isString]
      }
    ];
    const document = {
      id: "id"
    };

    const result = check(policy)(document);
    expect(result.requirements.length).toBe(0);
    expect(result.requirements).toEqual([]);
  });

  it("should contain a list of uncompliant fields in requirements", () => {
    const policy = [
      {
        path: ["id"],
        predicate: [isString]
      },
      {
        path: ["first_name"],
        predicate: [isString]
      },
      {
        path: ["last_name"],
        predicate: [isString]
      }
    ];
    const document = {
      id: "",
      first_name: undefined,
      last_name: 123
    };
    const result = check(policy)(document);
    expect(result.requirements.length).toBe(3);
    expect(result.requirements).toEqual(['id','first_name','last_name']);
  });
});
