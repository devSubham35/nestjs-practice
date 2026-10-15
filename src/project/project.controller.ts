import { ProjectService } from './project.service';
import { GetProjectsDto } from './dto/get-project.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserId } from 'src/common/decorator/common.decorator';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ValidateObjectIdPipe } from 'src/common/pipes/validate-object-id/validate-object-id.pipe';

@Controller('projects')
export class ProjectController {

  constructor(private readonly projectService: ProjectService) { }

  @Post("/")
  create(
    @UserId() userId: string,
    @Body() createProjectDto: CreateProjectDto
  ) {
    return this.projectService.create(userId, createProjectDto);
  }

  @Get("/")
  findAll(
    @UserId() userId: string,
    @Query() query: GetProjectsDto
  ) {
    return this.projectService.findAll(userId, query);
  }

  @Get(':id')
  findOne(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
    @Body() updateProjectDto: UpdateProjectDto
  ) {
    return this.projectService.update(userId, id, updateProjectDto);
  }

  @Delete(':id')
  softDelete(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.softDelete(userId, id);
  }

  @Delete(':id/delete')
  hardDelete(
    @Param('id', ValidateObjectIdPipe) id: string,
    @UserId() userId: string,
  ) {
    return this.projectService.hardDelete(userId, id);
  }
}
