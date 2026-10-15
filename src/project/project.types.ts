import type { CreateProjectDto } from './dto/create-project.dto';

export enum PROJECT_STATUS {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export type CreateProjectPayloadType = CreateProjectDto & {
  ownerId: string;
};
