import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    return await this.todoRepository.find();
  }

  async findOne(id: string) {
    try {
      return await this.todoRepository.findOneOrFail({ where: { id } });
    } catch (error) {
      throw new NotFoundException(
        `Todo with ID "${id}" not found ` + error.message,
      );
    }
  }
  async create(data) {
    return await this.todoRepository.save(this.todoRepository.create(data));
  }

  async update(id: string, data) {
    const todo = await this.findOne(id);
    this.todoRepository.merge(todo, data);

    return await this.todoRepository.save(todo);
  }

  async deleteById(id: string) {
    await this.findOne(id);

    await this.todoRepository.softDelete(id);
  }
}
