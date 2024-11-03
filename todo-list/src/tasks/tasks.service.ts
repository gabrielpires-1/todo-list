import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto) {
    const { title, difficulty, deadline, order, userId } = createTaskDto;

    return await this.prisma.task.create({
      data: {
        title,
        difficulty,
        deadline,
        order,
        user: {
          connect: { id: userId },
        },
      },
    });
  }

  async findAllByUser(userId: string) {
    return await this.prisma.task.findMany({
      where: { userId },
    });
  }

  async findOne(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || updateTaskDto.userId !== task.userId) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return await this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async remove(id: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return await this.prisma.task.delete({
      where: { id },
    });
  }
}
