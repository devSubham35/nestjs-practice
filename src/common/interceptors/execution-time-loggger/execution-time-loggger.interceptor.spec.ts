import { ExecutionTimeLogggerInterceptor } from './execution-time-loggger.interceptor';

describe('ExecutionTimeLogggerInterceptor', () => {
  it('should be defined', () => {
    expect(new ExecutionTimeLogggerInterceptor()).toBeDefined();
  });
});
