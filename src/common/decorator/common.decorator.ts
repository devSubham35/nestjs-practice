import { AuthenticatedUser } from '../common.types';
import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

///  Get the authenticated user
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user;
  },
);

/// Get only user id
export const UserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest<{ user: AuthenticatedUser }>();
    return request.user.sub;
  },
);
