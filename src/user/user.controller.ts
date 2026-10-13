import { TrimPipe } from './validation.pipe';
import { UserService } from './user.service';
import { ROLES } from 'src/common/common.types';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { Public } from 'src/common/decorator/public.decorator';
import { TrimPipe2 } from 'src/common/pipes/trim/trim.pipe';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Public()
    @Get("/")
    async getAllUsers(
        @Query("name", TrimPipe2) name: string
    ) {
        const users = await this.userService.getAllUsers(name)
        return {
            data: users,
            message: "All users fetched successfully"
        }
    }

    @UseGuards(RolesGuard)
    @Roles(ROLES.ADMIN)
    @Get("/:id")
    async getUserById(@Param("id") id: string) {
        const user = await this.userService.findById(id)

        return {
            data: user,
            message: "User fetched successfully"
        }
    }

}
