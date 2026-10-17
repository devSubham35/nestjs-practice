import { TrimPipe } from './trim.pipe';

describe('TrimPipe', () => {
  const pipe = new TrimPipe();

  it('allows an omitted optional query value', () => {
    expect(pipe.transform(undefined)).toBeUndefined();
  });

  it('trims a provided query value', () => {
    expect(pipe.transform('  Aarav  ')).toBe('Aarav');
  });
});
