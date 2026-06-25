import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { FetchRecentQuestionsResponseDto } from './dto/fetch-recent-questions-response.dto';
import { PageQueryDto } from './dto/page-query.dto';

// Quantidade de perguntas retornadas por página.
const QUESTIONS_PER_PAGE = 20;

@ApiTags('questions')
@ApiBearerAuth()
@Controller('questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Lista as perguntas mais recentes (paginado)' })
  @ApiOkResponse({
    description: 'Lista de perguntas mais recentes',
    type: FetchRecentQuestionsResponseDto,
  })
  async handle(
    @Query() query: PageQueryDto,
  ): Promise<FetchRecentQuestionsResponseDto> {
    const { page } = query;

    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: QUESTIONS_PER_PAGE,
      skip: (page - 1) * QUESTIONS_PER_PAGE,
    });

    return { questions };
  }
}
