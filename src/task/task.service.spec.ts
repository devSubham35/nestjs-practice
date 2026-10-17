import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getModelToken } from '@nestjs/mongoose';
import { Task } from './schemas/task.schema';
import { CounterService } from '../counter/counter.service';
import { ProjectService } from '../project/project.service';
import { TASK_STATUS } from './task.types';

describe('TaskService', () => {
  let service: TaskService;
  let taskModel: {
    find: jest.Mock;
    countDocuments: jest.Mock;
  };
  let projectService: { findOne: jest.Mock };

  beforeEach(async () => {
    taskModel = {
      find: jest.fn(),
      countDocuments: jest.fn(),
    };
    projectService = { findOne: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: CounterService, useValue: { getNextSequence: jest.fn() } },
        { provide: ProjectService, useValue: projectService },
        { provide: getModelToken(Task.name), useValue: taskModel },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('paginates tasks and keeps query controls out of the MongoDB filter', async () => {
    const tasks = [{ taskId: 'TASK-3' }, { taskId: 'TASK-2' }];
    const exec = jest.fn().mockResolvedValue(tasks);
    const limit = jest.fn().mockReturnValue({ exec });
    const skip = jest.fn().mockReturnValue({ limit });
    const lean = jest.fn().mockReturnValue({ skip });
    const sort = jest.fn().mockReturnValue({ lean });

    projectService.findOne.mockResolvedValue({
      data: { _id: 'project-id' },
    });
    taskModel.find.mockReturnValue({ sort });
    taskModel.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(5),
    });

    const result = await service.findAll('project-id', {
      page: 2,
      limit: 2,
      search: 'login',
      status: TASK_STATUS.PENDING,
    });

    expect(taskModel.find).toHaveBeenCalledWith({
      status: TASK_STATUS.PENDING,
      projectId: 'project-id',
      $or: [
        { taskId: { $regex: 'login', $options: 'i' } },
        { title: { $regex: 'login', $options: 'i' } },
      ],
    });
    expect(skip).toHaveBeenCalledWith(2);
    expect(limit).toHaveBeenCalledWith(2);
    expect(result).toEqual({
      data: {
        results: tasks,
        meta: {
          page: 2,
          limit: 2,
          total: 5,
          totalPages: 3,
          hasPreviousPage: true,
          hasNextPage: true,
        },
      },
      message: 'Task fetched successfully',
    });
  });
});
