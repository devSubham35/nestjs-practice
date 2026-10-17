import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CounterService } from './counter.service';
import { Counter, CounterSchema } from './schemas/counter.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Counter.name, schema: CounterSchema }])],
  exports: [CounterService],
  providers: [CounterService],
})
export class CounterModule {}
