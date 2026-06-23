import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { UserPayload } from './jwt.strategy';

// Extrai o payload do token (injetado pela JwtStrategy) de `request.user`.
// Uso: `handle(@CurrentUser() user: UserPayload) { ... }`.
export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest();

    return request.user;
  },
);
