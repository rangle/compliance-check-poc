import { main } from './cli';

describe('cli entry', () => {
  it('exits if there first argument is not check or submit', () => {
    let didRun = false;
    const exit: any = () => (didRun = true);
    main([], exit, () => 'foo' as any, () => undefined as any);
    expect(didRun).toBe(true);
  });

  it('exits if there is no second argument', () => {
    let didRun = false;
    const exit: any = () => (didRun = true);
    main([], exit, () => 'foo' as any, () => undefined as any);
    expect(didRun).toBe(true);
  });

  it('exits if readFileSync throws', () => {
    let didRun = false;
    const exit: any = () => (didRun = true);
    const readFile: any = () => {
      throw new Error('foo');
    };
    main(['node', 'script', 'check', 'input.json'], exit, readFile, () => undefined as any);
    expect(didRun).toBe(true);
  });

  it('checks documents', () => {
    let didRun = false;
    const exit: any = () => (didRun = true);
    const readFile: any = () => {
      return '{}';
    };
    main(['node', 'script', 'check', 'input.json'], exit, readFile, () => undefined as any);
    expect(didRun).toBe(false);
  });
});
