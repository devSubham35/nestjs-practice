import { UserService } from './user.service';
import { ROLES } from 'src/common/common.types';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { BadRequestException, Controller, Get, Param, UseGuards } from '@nestjs/common';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get("/")
    async getAllUsers(){
        const users = await this.userService.getAllUsers()
        return {
            data: users,
            message: "All users fetched successfully"
        }
    }

    @UseGuards(RolesGuard)
    @Roles(ROLES.ADMIN)
    @Get("/:id")
    async getUserById(@Param("id") id: string){
        const user = await this.userService.findById(id)

        return {
            data: user,
            message: "User fetched successfully"
        }
    }

}
