import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

// `select` garante que o `password` nunca seja retornado nas respostas.
const userPublicFields = {
  id: true,
  name: true,
  email: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      select: userPublicFields,
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: userPublicFields,
    });
  }
}
