import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './task.controller';
import { Task, TaskSchema } from './schemas/task.schema';
import { CounterModule } from 'src/counter/counter.module';
import { ProjectModule } from 'src/project/project.module';

@Module({
  imports: [
    CounterModule,
    ProjectModule,
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }])
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
