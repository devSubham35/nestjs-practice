import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Counter } from './schemas/counter.schema';

@Injectable()
export class CounterService {

    constructor(@InjectModel(Counter.name) private counterModel: Model<Counter>) {}

    async getNextSequence(name: string): Promise<number> {
        const counter = await this.counterModel.findOneAndUpdate(
            { name },
            { $inc: { seq: 1 } },
            {
                new: true,
                upsert: true,
            },
        );

        return counter.seq;
    }
}
