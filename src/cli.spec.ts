import { main } from './cli';

describe('cli entry', () => {
  it('exits if there is no first argument', () => {
    let didRun = false;
    const exit: any = () => (didRun = true);
    main([], exit, () => 'foo' as any);
    expect(didRun).toBe(true);
  });

  it('exits if readFileSync throws', () => {
    let didRun = false;
    const exit: any = () => (didRun = true);
    const readFile: any = () => {
      throw new Error('foo');
    };
    main(['node', 'script', 'input.json'], exit, readFile);
    expect(didRun).toBe(true);
  });
});
