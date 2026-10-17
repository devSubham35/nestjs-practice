export function toMongoDate(
  date: string,
  boundary: 'start' | 'end' = 'start',
): Date {
  const [year, month, day] = date.split('-').map(Number);
  const isEndOfDay = boundary === 'end';

  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      isEndOfDay ? 23 : 0,
      isEndOfDay ? 59 : 0,
      isEndOfDay ? 59 : 0,
      isEndOfDay ? 999 : 0,
    ),
  );
}

export interface DateRangeType {
  $gte?: Date;
  $lte?: Date;
}

export const getDateRange = (startDate?: string, endDate?: string) => {
  const dateRange: DateRangeType = {};

  if (startDate && endDate) {
    dateRange.$gte = toMongoDate(startDate);
    dateRange.$lte = toMongoDate(endDate, 'end');
  }

  return dateRange;
};
