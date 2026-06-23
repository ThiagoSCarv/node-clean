import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AccountResponseDto } from './dto/account-response.dto';
import { CreateAccountDto } from './dto/create-account.dto';

// Número de rounds usado pelo bcrypt para gerar o salt da senha.
const HASH_SALT_ROUNDS = 8;

@ApiTags('accounts')
@Controller('accounts')
export class CreateAccountController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria uma nova conta de usuário' })
  @ApiCreatedResponse({
    description: 'Conta criada com sucesso',
    type: AccountResponseDto,
  })
  @ApiConflictResponse({
    description: 'Já existe um usuário com o e-mail informado',
  })
  async handle(@Body() body: CreateAccountDto): Promise<AccountResponseDto> {
    const { name, email, password } = body;

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: { email },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        'Já existe um usuário com o e-mail informado.',
      );
    }

    // Nunca armazenamos a senha em texto puro: geramos o hash com bcrypt.
    const hashedPassword = await hash(password, HASH_SALT_ROUNDS);

    return this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      // `select` garante que o `password` nunca seja retornado na resposta.
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
