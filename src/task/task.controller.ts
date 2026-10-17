import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksQueryDto } from './dto/filter-tasks-query.dto';
import { UserId } from 'src/common/decorator/common.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id/validate-object-id.pipe';

/*

- filter by multiple projects
- filter by status
- filter by priorities
- filter by date range
- Add pagination

*/

@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  //////////////////////////////////////////////////////////
  /// Create a task under a project
  //////////////////////////////////////////////////////////

  @Post()
  async create(
    @UserId() userId: string,
    @Body() createTaskDto: CreateTaskDto,
    @Param('projectId', ValidateObjectIdPipe) projectId: string,
  ) {
    return await this.taskService.create({
      userId,
      projectId,
      createTaskDto,
    });
  }

  //////////////////////////////////////////////////////////
  /// Find all tasks under a project
  //////////////////////////////////////////////////////////

  @Get()
  async findAll(
    @Param('projectId', ValidateObjectIdPipe) projectId: string,
    @Query() filters: FilterTasksQueryDto,
  ) {
    return await this.taskService.findAll(projectId, filters);
  }

  //////////////////////////////////////////////////////////
  /// Find a task under a project
  //////////////////////////////////////////////////////////

  @Get(':id')
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Param('projectId', ValidateObjectIdPipe) projectId: string,
  ) {
    return this.taskService.findOne({
      id,
      projectId,
    });
  }

  //////////////////////////////////////////////////////////
  /// Update a task under a project
  //////////////////////////////////////////////////////////

  @Patch(':id')
  async update(
    @Body() updatedPayload: UpdateTaskDto,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Param('projectId', ValidateObjectIdPipe) projectId: string,
  ) {
    return await this.taskService.update({
      id,
      projectId,
      updatedPayload,
    });
  }

  //////////////////////////////////////////////////////////
  /// Delete a task under a project
  //////////////////////////////////////////////////////////

  @Delete(':id')
  async remove(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Param('projectId', ValidateObjectIdPipe) projectId: string,
  ) {
    return await this.taskService.remove({
      id,
      projectId,
    });
  }
}
