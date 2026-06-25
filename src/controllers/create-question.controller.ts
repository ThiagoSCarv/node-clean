import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserPayload } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { createSlug } from '../utils/create-slug';
import { CreateQuestionDto } from './dto/create-question.dto';
import { CreateQuestionResponseDto } from './dto/create-question-response.dto';

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Cria uma nova pergunta' })
  @ApiCreatedResponse({
    description: 'Pergunta criada com sucesso',
    type: CreateQuestionResponseDto,
  })
  @ApiConflictResponse({
    description: 'Já existe uma pergunta com o mesmo título (slug duplicado)',
  })
  async handle(
    @Body() body: CreateQuestionDto,
    @CurrentUser() user: UserPayload,
  ): Promise<CreateQuestionResponseDto> {
    const { title, content } = body;

    // O slug é derivado do título e precisa ser único (constraint do banco).
    const slug = createSlug(title);

    const questionWithSameSlug = await this.prisma.question.findUnique({
      where: { slug },
    });

    if (questionWithSameSlug) {
      throw new ConflictException('Já existe uma pergunta com o mesmo título.');
    }

    return this.prisma.question.create({
      data: {
        title,
        content,
        slug,
        authorId: user.sub,
      },
      // `select` garante uma resposta enxuta e previsível.
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        createdAt: true,
      },
    });
  }
}
