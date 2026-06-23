import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Guard que dispara a `JwtStrategy` ('jwt'). Use com `@UseGuards(JwtAuthGuard)`.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
