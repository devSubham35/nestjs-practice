import { toMongoDate } from './common.utils';

describe('toMongoDate', () => {
  it('converts YYYY-MM-DD to the start of the UTC day', () => {
    expect(toMongoDate('2026-10-01')).toEqual(
      new Date('2026-10-01T00:00:00.000Z'),
    );
  });

  it('converts YYYY-MM-DD to the end of the UTC day', () => {
    expect(toMongoDate('2026-10-01', 'end')).toEqual(
      new Date('2026-10-01T23:59:59.999Z'),
    );
  });
});
