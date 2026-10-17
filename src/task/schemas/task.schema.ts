import { User } from 'src/user/schemas/userSchema';
import { TASK_PRIORITY, TASK_STATUS } from '../task.types';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Project } from 'src/project/schemas/project.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProjectDocument = HydratedDocument<Task>;

@Schema({ versionKey: false, timestamps: true })
export class Task {

  @Prop({
    index: true,
    unique: true,
    required: true,
  })
  taskId!: string;

  @Prop({
    minlength: 3,
    maxLength: 100,
    required: true,
  })
  title!: string;

  @Prop({ maxLength: 200 })
  description?: string;

  @Prop({})
  dueDate?: Date

  @Prop({
    ref: User.name,
    required: true,
    type: mongoose.Schema.Types.ObjectId,
  })
  createdBy!: Types.ObjectId;

  @Prop({
    required: true,
    ref: Project.name,
    type: mongoose.Schema.Types.ObjectId,
  })
  projectId!: Types.ObjectId;

  @Prop({
    ref: 'User',
    default: [],
    type: [Types.ObjectId],
  })
  assignedTo?: Types.ObjectId[];

  @Prop({
    type: String,
    enum: TASK_STATUS,
    default: TASK_STATUS.PENDING
  })
  status!: TASK_STATUS;

  @Prop({
    type: String,
    enum: TASK_PRIORITY,
  })
  priority!: TASK_PRIORITY;

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
