import { Model } from 'mongoose';
import { User } from './schemas/userSchema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from './../auth/dto/auth.dto';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }

    /// Find user by email
    async findByEmail(email: string) {
        return await this.userModel.findOne({ email }).lean()
    }

    /// Find user by id
    async findById(id: string) {
        return await this.userModel.findOne({ _id: id }).lean()
    }

    /// Create new user
    async create(signUpDto: SignUpDto) {

        const newUser = await this.userModel.create({
            name: signUpDto.name,
            email: signUpDto.email,
            password: signUpDto.password,
        })

        return {
            _id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        }
    }

}
