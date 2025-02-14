// src/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { User } from '../modules/users/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();
    console.log('=== CurrentUser Decorator ===');
    console.log('Request user:', request.user);
    console.log('User ID:', request.user?.id);
    console.log('User ID type:', typeof request.user?.id);

    if (!request.user || !request.user.id) {
      throw new BadRequestException('User not found or invalid');
    }

    // Vérifier si l'ID est un UUID valide
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(request.user.id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    return request.user;
  },
);