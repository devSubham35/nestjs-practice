import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { CounterService } from '../counter/counter.service';
import { ProjectService } from '../project/project.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: CounterService, useValue: { getNextSequence: jest.fn() } },
        { provide: ProjectService, useValue: { findOne: jest.fn() } },
        { provide: getModelToken(Task.name), useValue: {} },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
