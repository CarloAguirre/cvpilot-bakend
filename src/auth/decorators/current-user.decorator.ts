import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

export const CurrentUser = createParamDecorator(
  (
    property: keyof AuthenticatedUser | undefined,
    context: ExecutionContext,
  ) => {
    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedUser;
    }>();
    const user = request.user;

    if (!property) {
      return user;
    }

    return user?.[property];
  },
);