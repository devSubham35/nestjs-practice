import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Project } from './schemas/project.schema';
import { GetProjectsDto } from './dto/get-project.dto';
import { CreateProjectPayloadType } from './project.types';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { paginate } from 'src/common/pagination/pagination.utils';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProjectService {

  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) { }

  //////////////////////////////////////////////////////////
  /// Create project service
  //////////////////////////////////////////////////////////

  async create(userId: string, createProjectDto: CreateProjectDto) {

    const createProjectPayload: CreateProjectPayloadType = {
      ownerId: userId,
      name: createProjectDto.name,
      description: createProjectDto.description,
    };

    if (createProjectDto.status) {
      createProjectPayload.status = createProjectDto.status;
    }

    const newProject = await this.projectModel.create(createProjectPayload);

    return {
      data: newProject,
      message: "Project created successfully",
    }
  }

  //////////////////////////////////////////////////////////
  /// Find all projects of a authnticated user service
  //////////////////////////////////////////////////////////

  async findAll(userId: string, query: GetProjectsDto) {

    const { page = 1, limit = 10, status, trash } = query;

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      ownerId: userId,
      isDeleted: trash ?? false,
    };

    if (status) {
      filter.status = status;
    }

    const paginatedResult = await paginate(
      this.projectModel
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .lean(),
      this.projectModel.countDocuments(filter),
      page,
      limit,
    );

    return {
      ...paginatedResult,
      message: 'Projects fetched successfully',
    }
  }

  //////////////////////////////////////////////////////////
  /// Find project by id
  //////////////////////////////////////////////////////////

  async findOne(userId: string, id: string) {

    const project = await this.projectModel
      .findOne({
        _id: id,
        ownerId: userId,
        isDeleted: false,
      })
      .lean()
      .exec()

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return {
      data: project,
      message: 'Projects fetched successfully',
    }
  }

  //////////////////////////////////////////////////////////
  /// Update project service
  //////////////////////////////////////////////////////////

  async update(userId: string, id: string, updatePayload: UpdateProjectDto) {

    if (Object.keys(updatePayload).length === 0) {
      throw new BadRequestException(
        'At least one field must be provided for update',
      );
    }

    const updatedProject = await this.projectModel
      .findOneAndUpdate(
        { _id: id, ownerId: userId, isDeleted: false },
        { $set: updatePayload },
        { new: true, runValidators: true },
      )
      .exec();

    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }

    return {
      data: updatedProject,
      message: 'Project updated successfully',
    };
  }

  //////////////////////////////////////////////////////////
  /// Soft Delete project service
  //////////////////////////////////////////////////////////

  async softDelete(userId: string, id: string) {

    const updatedProject = await this.projectModel
      .findOneAndUpdate(
        { _id: id, ownerId: userId, isDeleted: false },
        { $set: { isDeleted: true } },
        { new: true, runValidators: true },
      )
      .exec()

    if (!updatedProject) {
      throw new NotFoundException('Project not found or already deleted');
    }

    return {
      data: updatedProject,
      message: 'Project moved to trash successfully',
    }
  }

  //////////////////////////////////////////////////////////
  /// Hard Delete project service
  //////////////////////////////////////////////////////////

  async hardDelete(userId: string, id: string) {

    const deletedProject = await this.projectModel.findOneAndDelete({
      _id: id,
      ownerId: userId,
      isDeleted: true
    }).exec()

    if (!deletedProject) {
      throw new NotFoundException('Project not found in trash');
    }

    return {
      data: deletedProject,
      message: 'Project permanently deleted',
    };
  }
}
