import { ExecutionTimeLoggerInterceptor } from './execution-time-loggger.interceptor';

describe('ExecutionTimeLoggerInterceptor', () => {
  it('should be defined', () => {
    expect(new ExecutionTimeLoggerInterceptor()).toBeDefined();
  });
});
