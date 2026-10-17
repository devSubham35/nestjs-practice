import { UserService } from './user.service';
import { ROLES } from 'src/common/common.types';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { TrimPipe } from 'src/common/pipes/trim/trim.pipe';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  errorResponse,
  successResponse,
  SWAGGER_IDS,
  USER_EXAMPLE,
} from 'src/common/swagger/swagger.examples';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('/')
  @ApiOperation({ summary: 'List users, optionally filtered by name' })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Case-insensitive partial name search',
    example: 'Aarav',
  })
  @ApiOkResponse({
    description: 'The matching users.',
    example: successResponse(200, 'All users fetched successfully', [
      USER_EXAMPLE,
    ]),
  })
  async getAllUsers(@Query('name', TrimPipe) name?: string) {
    const users = await this.userService.getAllUsers(name);
    return {
      data: users,
      message: 'All users fetched successfully',
    };
  }

  @UseGuards(RolesGuard)
  @Roles(ROLES.ADMIN)
  @Get('/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID (admin only)' })
  @ApiParam({
    name: 'id',
    description: 'MongoDB ObjectId of the user',
    example: SWAGGER_IDS.user,
  })
  @ApiOkResponse({
    description: 'The requested user.',
    example: successResponse(200, 'User fetched successfully', USER_EXAMPLE),
  })
  @ApiBadRequestResponse({
    description: 'The user ID is invalid or the user was not found.',
    example: errorResponse(400, 'User not found or invalied user id'),
  })
  @ApiUnauthorizedResponse({
    description: 'A valid bearer token was not supplied.',
    example: errorResponse(401, 'Unauthorized'),
  })
  @ApiForbiddenResponse({
    description: 'The authenticated user does not have the admin role.',
    example: errorResponse(403, 'Forbidden resource'),
  })
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);

    return {
      data: user,
      message: 'User fetched successfully',
    };
  }
}
