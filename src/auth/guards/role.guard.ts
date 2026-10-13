import { Reflector } from '@nestjs/core';
import { ROLES } from 'src/common/common.types';
import { ROLES_KEY } from 'src/common/decorator/roles.decorator';
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const requiredRoles = this.reflector.getAllAndOverride<ROLES[]>(
      ROLES_KEY,
      [
        context.getClass(),
        context.getHandler()
      ]
    )


    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user || !Array.isArray(user.roles)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    const hasRole = requiredRoles.some((role) =>
      user.roles.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }

}
