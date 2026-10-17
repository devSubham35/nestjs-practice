import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CounterService } from './../counter/counter.service';
import { ProjectService } from './../project/project.service';
import {
  CreateTaskServicePayload,
  DeleteTaskServicePayload,
  UpdateTaskServicePayload,
} from './task.types';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

@Injectable()
export class TaskService {
  constructor(
    private readonly counterService: CounterService,
    private readonly projectService: ProjectService,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) {}

  //////////////////////////////////////////////////////////
  /// Create Task Service
  //////////////////////////////////////////////////////////

  async create({ userId, projectId, createTaskDto }: CreateTaskServicePayload) {
    const project = await this.projectService.findOne({
      userId,
      id: projectId,
    });

    if (!project.data) {
      throw new NotFoundException('Project not found');
    }

    const taskNumber = await this.counterService.getNextSequence('task');
    const taskId = `TASK-${taskNumber}`;

    const task = await this.taskModel.create({
      taskId,
      ...createTaskDto,
      createdBy: userId,
      projectId: project.data._id,
    });

    return {
      data: task,
      message: 'Task created',
    };
  }

  //////////////////////////////////////////////////////////
  /// Find all task under a project
  //////////////////////////////////////////////////////////

  async findAll(projectId: string) {
    const project = await this.projectService.findOne({
      id: projectId,
    });

    if (!project.data) {
      throw new NotFoundException('Project not found');
    }

    const tasks = await this.taskModel.find({
      projectId: project.data._id,
    });

    return {
      data: tasks,
      message: 'Task fetched successfully',
    };
  }

  //////////////////////////////////////////////////////////
  /// Find a task under a project
  //////////////////////////////////////////////////////////

  async findOne({ projectId, id }: { projectId: string; id: string }) {
    const project = await this.projectService.findOne({
      id: projectId,
    });

    if (!project.data) {
      throw new NotFoundException('Project not found');
    }

    const task = await this.taskModel.findOne({
      _id: id,
      projectId: project.data._id,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return {
      data: task,
      message: 'Task fetched successfully',
    };
  }

  //////////////////////////////////////////////////////////
  /// Update a task
  //////////////////////////////////////////////////////////

  async update({ id, projectId, updatedPayload }: UpdateTaskServicePayload) {
    const project = await this.projectService.findOne({
      id: projectId,
    });

    if (!project.data) {
      throw new NotFoundException('Project not found');
    }

    const task = await this.taskModel.findOneAndUpdate(
      {
        _id: id,
        projectId: project.data._id,
      },
      { $set: updatedPayload },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!task) {
      throw new BadRequestException('Failed to update task');
    }

    return {
      data: task,
      message: 'Task updated successfully',
    };
  }

  //////////////////////////////////////////////////////////
  /// Delete a task
  //////////////////////////////////////////////////////////

  async remove({ id, projectId }: DeleteTaskServicePayload) {
    const project = await this.projectService.findOne({
      id: projectId,
    });

    if (!project.data) {
      throw new NotFoundException('Project not found');
    }

    const deletedTask = await this.taskModel
      .findOneAndDelete({
        _id: id,
        projectId: project.data._id,
      })
      .exec();

    if (!deletedTask) {
      throw new NotFoundException('Task not found');
    }

    return {
      data: deletedTask,
      message: 'Task permanently deleted',
    };
  }
}
