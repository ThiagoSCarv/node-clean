import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { AuthenticateResponseDto } from './dto/authenticate-response.dto';

@ApiTags('sessions')
@Controller('sessions')
export class AuthenticateController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  @Post()
  @HttpCode(200)
  @ApiOperation({ summary: 'Autentica um usuário e retorna um token JWT' })
  @ApiOkResponse({
    description: 'Autenticação realizada com sucesso',
    type: AuthenticateResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  async handle(
    @Body() body: AuthenticateDto,
  ): Promise<AuthenticateResponseDto> {
    const { email, password } = body;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Mensagem genérica para não revelar se o e-mail existe.
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    // O token é assinado com a chave privada (RS256) configurada no JwtModule.
    const accessToken = this.jwt.sign({ sub: user.id });

    return { access_token: accessToken };
  }
}
