import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { EnvService } from '../env/env.service';

// Formato esperado do payload do token. `sub` é o id do usuário autenticado.
const tokenPayloadSchema = z.object({
  sub: z.uuid(),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // A verificação usa a chave pública; RS256 fixa o algoritmo aceito.
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  // O retorno é injetado em `request.user`.
  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
