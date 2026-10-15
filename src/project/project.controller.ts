import { ProjectService } from './project.service';
import { GetProjectsDto } from './dto/get-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserId } from 'src/common/decorator/common.decorator';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id/validate-object-id.pipe';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  errorResponse,
  PROJECT_EXAMPLE,
  successResponse,
  SWAGGER_IDS,
} from 'src/common/swagger/swagger.examples';

@ApiTags('Projects')
@ApiBearerAuth()
@ApiUnauthorizedResponse({
  description: 'A valid bearer token was not supplied.',
  example: errorResponse(401, 'Unauthorized'),
})
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create a project' })
  @ApiCreatedResponse({
    description: 'The project was created successfully.',
    example: successResponse(
      201,
      'Project created successfully',
      PROJECT_EXAMPLE,
    ),
  })
  @ApiBadRequestResponse({
    description: 'The request body failed validation.',
    example: errorResponse(400, [
      'name must be longer than or equal to 3 characters',
    ]),
  })
  create(@UserId() userId: string, @Body() createProjectDto: CreateProjectDto) {
    return this.projectService.create(userId, createProjectDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'List the authenticated user’s projects' })
  @ApiOkResponse({
    description: 'A paginated list of projects.',
    example: successResponse(200, 'Projects fetched successfully', {
      results: [PROJECT_EXAMPLE],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasPreviousPage: false,
        hasNextPage: false,
      },
    }),
  })
  @ApiBadRequestResponse({
    description: 'One or more query parameters are invalid.',
    example: errorResponse(400, ['page must not be less than 1']),
  })
  findAll(@UserId() userId: string, @Query() query: GetProjectsDto) {
    return this.projectService.findAll(userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by ID' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the project',
    example: SWAGGER_IDS.project,
  })
  @ApiOkResponse({
    description: 'The requested project.',
    example: successResponse(
      200,
      'Projects fetched successfully',
      PROJECT_EXAMPLE,
    ),
  })
  @ApiBadRequestResponse({
    description: 'The project ID is not a valid MongoDB ObjectId.',
    example: errorResponse(400, 'Invalid MongoDB ObjectId'),
  })
  @ApiNotFoundResponse({
    description: 'No active project with this ID belongs to the current user.',
    example: errorResponse(404, 'Project not found'),
  })
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.findOne(userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the project',
    example: SWAGGER_IDS.project,
  })
  @ApiOkResponse({
    description: 'The updated project.',
    example: successResponse(200, 'Project updated successfully', {
      ...PROJECT_EXAMPLE,
      status: 'archived',
      updatedAt: '2026-10-15T10:15:00.000Z',
    }),
  })
  @ApiBadRequestResponse({
    description: 'The ID, body, or update payload is invalid.',
    examples: {
      emptyBody: {
        summary: 'No fields supplied',
        value: errorResponse(
          400,
          'At least one field must be provided for update',
        ),
      },
      invalidStatus: {
        summary: 'Invalid project status',
        value: errorResponse(400, [
          'status must be one of the following values: active, archived',
        ]),
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'The project was not found.',
    example: errorResponse(404, 'Project not found'),
  })
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(userId, id, updateProjectDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Move a project to trash' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the project',
    example: SWAGGER_IDS.project,
  })
  @ApiOkResponse({
    description: 'The project was moved to trash.',
    example: successResponse(200, 'Project moved to trash successfully', {
      ...PROJECT_EXAMPLE,
      isDeleted: true,
      updatedAt: '2026-10-15T10:30:00.000Z',
    }),
  })
  @ApiBadRequestResponse({
    description: 'The project ID is not a valid MongoDB ObjectId.',
    example: errorResponse(400, 'Invalid MongoDB ObjectId'),
  })
  @ApiNotFoundResponse({
    description: 'The project was not found or is already in trash.',
    example: errorResponse(404, 'Project not found or already deleted'),
  })
  softDelete(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.softDelete(userId, id);
  }

  @Delete(':id/delete')
  @ApiOperation({ summary: 'Permanently delete a project from trash' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the project',
    example: SWAGGER_IDS.project,
  })
  @ApiOkResponse({
    description: 'The trashed project was permanently deleted.',
    example: successResponse(200, 'Project permanently deleted', {
      ...PROJECT_EXAMPLE,
      isDeleted: true,
    }),
  })
  @ApiBadRequestResponse({
    description: 'The project ID is not a valid MongoDB ObjectId.',
    example: errorResponse(400, 'Invalid MongoDB ObjectId'),
  })
  @ApiNotFoundResponse({
    description: 'The project was not found in trash.',
    example: errorResponse(404, 'Project not found in trash'),
  })
  hardDelete(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.hardDelete(userId, id);
  }
}
