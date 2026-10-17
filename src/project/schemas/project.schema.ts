import { PROJECT_STATUS } from '../project.types';
import { User } from 'src/user/schemas/userSchema';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({ versionKey: false, timestamps: true })
export class Project {
  @Prop({ required: true, minlength: 3, maxLength: 100 })
  name!: string;

  @Prop({ maxLength: 200 })
  description?: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  ownerId!: Types.ObjectId;

  @Prop({
    ref: 'User',
    default: [],
    type: [Types.ObjectId],
  })
  members!: Types.ObjectId[];

  @Prop({ 
    type: String, 
    enum: PROJECT_STATUS, 
    default: PROJECT_STATUS.ACTIVE 
  })
  status?: PROJECT_STATUS;

  @Prop({ default: false })
  isDeleted?: boolean

  @Prop()
  createdAt!: Date;

  @Prop()
  updatedAt!: Date;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);

ProjectSchema.index({
  ownerId: 1,
  isDeleted: 1,
  createdAt: -1,
});
