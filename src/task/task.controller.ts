import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UserId } from 'src/common/decorator/common.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id/validate-object-id.pipe';
import { errorResponse, successResponse, SWAGGER_IDS, TASK_EXAMPLE } from 'src/common/swagger/swagger.examples';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';


@ApiTags('Tasks')
@ApiBearerAuth()
@ApiParam({
  name: 'projectId',
  description: 'MongoDB ObjectId of the parent project',
  example: SWAGGER_IDS.project,
})
@ApiUnauthorizedResponse({
  description: 'A valid bearer token was not supplied.',
  example: errorResponse(401, 'Unauthorized'),
})
@Controller('projects/:projectId/tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a task in a project' })
  @ApiCreatedResponse({
    description: 'The task was created successfully.',
    example: successResponse(201, 'Task created', TASK_EXAMPLE),
  })
  @ApiBadRequestResponse({
    description: 'The project ID or request body is invalid.',
    example: errorResponse(400, [
      'title must be longer than or equal to 3 characters',
    ]),
  })
  @ApiNotFoundResponse({
    description: 'The project was not found.',
    example: errorResponse(404, 'Project not found'),
  })
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

  @Get()
  @ApiOperation({ summary: 'List all tasks in a project' })
  @ApiOkResponse({
    description: 'The tasks in the project.',
    example: successResponse(200, 'Task fetched successfully', [TASK_EXAMPLE]),
  })
  @ApiBadRequestResponse({
    description: 'The project ID is not a valid MongoDB ObjectId.',
    example: errorResponse(400, 'Invalid MongoDB ObjectId'),
  })
  @ApiNotFoundResponse({
    description: 'The project was not found.',
    example: errorResponse(404, 'Project not found'),
  })
  async findAll(@Param('projectId', ValidateObjectIdPipe) projectId: string) {
    return await this.taskService.findAll(projectId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the task',
    example: SWAGGER_IDS.task,
  })
  @ApiOkResponse({
    description: 'The requested task.',
    example: successResponse(200, 'Task fetched successfully', TASK_EXAMPLE),
  })
  @ApiBadRequestResponse({
    description: 'The project or task ID is not a valid MongoDB ObjectId.',
    example: errorResponse(400, 'Invalid MongoDB ObjectId'),
  })
  @ApiNotFoundResponse({
    description: 'The project or task was not found.',
    example: errorResponse(404, 'Task not found'),
  })
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Param('projectId', ValidateObjectIdPipe) projectId: string,
  ) {
    return this.taskService.findOne({
      id,
      projectId,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the task',
    example: SWAGGER_IDS.task,
  })
  @ApiOkResponse({
    description: 'The updated task.',
    example: successResponse(200, 'Task updated successfully', {
      ...TASK_EXAMPLE,
      status: 'in_progress',
      updatedAt: '2026-10-16T10:00:00.000Z',
    }),
  })
  @ApiBadRequestResponse({
    description: 'The ID, request body, or update operation is invalid.',
    example: errorResponse(400, 'Failed to update task'),
  })
  @ApiNotFoundResponse({
    description: 'The project was not found.',
    example: errorResponse(404, 'Project not found'),
  })
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

  @Delete(':id')
  @ApiOperation({ summary: 'Permanently delete a task' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the task',
    example: SWAGGER_IDS.task,
  })
  @ApiOkResponse({
    description: 'The task was permanently deleted.',
    example: successResponse(200, 'Task permanently deleted', TASK_EXAMPLE),
  })
  @ApiBadRequestResponse({
    description: 'The project or task ID is not a valid MongoDB ObjectId.',
    example: errorResponse(400, 'Invalid MongoDB ObjectId'),
  })
  @ApiNotFoundResponse({
    description: 'The project or task was not found.',
    example: errorResponse(404, 'Task not found'),
  })
  async remove(
    @UserId() userId: string,
    @Param('id', ValidateObjectIdPipe) id: string,
    @Param('projectId', ValidateObjectIdPipe) projectId: string,
  ) {
    return await this.taskService.remove({
      id,
      projectId,
    });
  }
}
