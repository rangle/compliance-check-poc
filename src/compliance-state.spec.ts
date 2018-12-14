import {
  openOrCreateDb,
  writeDb,
  submitDocument,
  createRecord,
  checkRequirements
} from './compliance-state';
import { checkCompliance } from './policy-check';

describe('compliance state', () => {
  describe('checkRequirements', () => {
    it('returns the original output if there is only one record', () => {
      const output: any = {};
      expect(checkRequirements([{} as any], output)).toBe(output);
    });

    it('adds an item to past_due if a requirement is over a minute old', () => {
      const reqs: any = { requirements: ['Foo'] };
      const output = checkRequirements(
        [
          {
            id: 'test',
            requirements: ['Foo'],
            timestamp: 0
          },
          {
            id: 'test',
            requirements: ['Foo'],
            timestamp: 60000
          }
        ],
        reqs
      );

      expect(output.past_due).toEqual(['Foo']);
    });

    describe('given scenarios', () => {
      const input1 = { id: '0' };

      const input2 = { id: '0', first_name: 'Veruca', last_name: 'Salt' };

      const input3 = {
        id: '0',
        first_name: 'Veruca',
        last_name: 'Salt',
        address: {
          country: 'AT',
          street: '45 Dale Ln'
        }
      };

      const input4 = {
        id: '0',
        first_name: 'Veruca',
        last_name: 'Salt',
        address: {
          country: 'AT',
          postal_code: '123456'
        }
      };

      const input5 = {
        id: '0',
        first_name: 'Veruca',
        last_name: 'Salt',
        tax_id: '777889999',
        address: { country: 'AT', postal_code: '123456', city: 'Vienna' }
      };

      const output1 = {
        compliant: false,
        requirements: [
          'first_name',
          'last_name',
          'tax_id',
          'address.street',
          'address.city',
          'address.postal_code',
          'address.country'
        ],
        past_due: []
      };

      const output2 = {
        compliant: false,
        requirements: [
          'tax_id',
          'address.street',
          'address.city',
          'address.postal_code',
          'address.country'
        ],
        past_due: []
      };

      const output3 = {
        compliant: false,
        requirements: ['tax_id', 'address.city', 'address.postal_code'],
        past_due: []
      };

      const output4 = {
        compliant: false,
        requirements: [
          'tax_id',
          'address.street', // `street` has been removed and is a re quirement once again
          'address.city'
        ],
        past_due: [
          'tax_id',
          'address.city'
          // `address.street` is not past_due because it has not been a requirement for 60s
        ]
      };

      const output5 = {
        compliant: false,
        requirements: ['address.street'],
        past_due: [
          'address.street' // `street` has now been a requirement for 60s and is past_due.
        ]
      };

      it('matches output for the first input', () => {
        expect(
          checkRequirements(
            [
              {
                id: 'test',
                requirements: output1.requirements,
                timestamp: 0
              }
            ],
            checkCompliance(input1)
          )
        ).toEqual(output1);
      });

      it('matches output for the second input', () => {
        expect(
          checkRequirements(
            [
              {
                id: 'test',
                requirements: output1.requirements,
                timestamp: 0
              },
              {
                id: 'test',
                requirements: output2.requirements,
                timestamp: 20000
              }
            ],
            checkCompliance(input2)
          )
        ).toEqual(output2);
      });

      it('matches output for the third input', () => {
        expect(
          checkRequirements(
            [
              {
                id: 'test',
                requirements: output1.requirements,
                timestamp: 0
              },
              {
                id: 'test',
                requirements: output2.requirements,
                timestamp: 20000
              },
              {
                id: 'test',
                requirements: output3.requirements,
                timestamp: 40000
              }
            ],
            checkCompliance(input3)
          )
        ).toEqual(output3);
      });

      it('matches output for the fourth input', () => {
        expect(
          checkRequirements(
            [
              {
                id: 'test',
                requirements: output1.requirements,
                timestamp: 0
              },
              {
                id: 'test',
                requirements: output2.requirements,
                timestamp: 20000
              },
              {
                id: 'test',
                requirements: output3.requirements,
                timestamp: 40000
              },
              {
                id: 'test',
                requirements: output4.requirements,
                timestamp: 60000
              }
            ],
            checkCompliance(input4)
          )
        ).toEqual(output4);
      });

      it('matches output for the fifth input', () => {
        expect(
          checkRequirements(
            [
              {
                id: 'test',
                requirements: output1.requirements,
                timestamp: 0
              },
              {
                id: 'test',
                requirements: output2.requirements,
                timestamp: 20000
              },
              {
                id: 'test',
                requirements: output3.requirements,
                timestamp: 40000
              },
              {
                id: 'test',
                requirements: output4.requirements,
                timestamp: 60000
              },
              {
                id: 'test',
                requirements: output5.requirements,
                timestamp: 120000
              }
            ],
            checkCompliance(input5)
          )
        ).toEqual(output5);
      });
    });
  });

  describe('createRecord', () => {
    it('returns a record with a timestamp', () => {
      expect(createRecord('foo', []).timestamp).toBeTruthy();
    });
  });

  describe('openOrCreateDb', () => {
    it('returns an object if the open function throws', () => {
      const readFile: any = () => {
        throw new Error('testing');
      };
      expect(openOrCreateDb(readFile)).toEqual({});
    });

    it('returns a parsed object if read succeeds', () => {
      const readFile: any = () => '{ "foo": true }';
      expect(openOrCreateDb(readFile)).toEqual({ foo: true });
    });
  });

  describe('submitDocument', () => {
    it('skips databasing if the id is malformed', () => {
      let didRead = false;
      let didWrite = false;
      const readFile: any = () => (didRead = true);
      const writeFile: any = () => (didWrite = true);

      submitDocument(readFile, writeFile)({});

      expect(didRead).toBe(false);
      expect(didWrite).toBe(false);
    });
  });

  describe('writeDb', () => {
    it('runs the writeFile function and stringifies given data', () => {
      let stringData = '';
      const writeFile: any = (name: any, data: any) => (stringData = data);
      writeDb(writeFile)({});
      expect(typeof stringData).toBe('string');
    });
  });
});
