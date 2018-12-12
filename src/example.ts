export function add(...args: number[]) {
  return args.reduce((total: number, next: number) => total + next, 0);
}
