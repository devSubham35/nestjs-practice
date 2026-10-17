import { Model } from 'mongoose';
import { User } from './schemas/userSchema';
import { InjectModel } from '@nestjs/mongoose';
import { SignUpDto } from './../auth/dto/auth.dto';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>) { }


    /// Find user by email
    async findByEmail(email: string) {
        try {
            return await this.userModel.findOne({ email }).exec()

        } catch (error) {
            throw new BadRequestException("User not found")
        }
    }

    /// Find user by id
    async findById(id: string) {
        try {
            return await this.userModel.findOne({ _id: id }).lean()

        } catch (error) {
            throw new BadRequestException("User not found or invalied user id")
        }
    }

    /// Create new user
    async create(signUpDto: SignUpDto) {

        const newUser = await this.userModel.create({
            name: signUpDto.name,
            email: signUpDto.email,
            password: signUpDto.password,
        })

        return newUser
    }

    /// Find user by email
    async getAllUsers(name?: string) {

        const filter = name
            ? { name: { $regex: name, $options: 'i' } }
            : {};

        return await this.userModel.find(filter).select('_id name email')
    }
}
