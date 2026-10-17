export const SWAGGER_IDS = {
  user: '507f1f77bcf86cd799439011',
  project: '64f1c2a3b4c5d6e7f8091234',
  task: '64f1c2a3b4c5d6e7f8095678',
};

export const USER_EXAMPLE = {
  _id: SWAGGER_IDS.user,
  name: 'Aarav Sharma',
  email: 'aarav.sharma@example.com',
  isVerified: false,
  isActive: true,
  roles: ['user'],
  createdAt: '2026-10-15T08:30:00.000Z',
  updatedAt: '2026-10-15T08:30:00.000Z',
};

export const PROJECT_EXAMPLE = {
  _id: SWAGGER_IDS.project,
  name: 'TaskFlow mobile app',
  description: 'Build and release the first version of the mobile app.',
  ownerId: SWAGGER_IDS.user,
  members: [SWAGGER_IDS.user],
  status: 'active',
  isDeleted: false,
  createdAt: '2026-10-15T09:00:00.000Z',
  updatedAt: '2026-10-15T09:00:00.000Z',
};

export const TASK_EXAMPLE = {
  _id: SWAGGER_IDS.task,
  taskId: 'TASK-1',
  title: 'Create the authentication screens',
  description: 'Implement sign-in and registration screens.',
  dueDate: '2026-10-31T18:30:00.000Z',
  createdBy: SWAGGER_IDS.user,
  projectId: SWAGGER_IDS.project,
  assignedTo: [SWAGGER_IDS.user],
  status: 'pending',
  priority: 'high',
  createdAt: '2026-10-16T09:00:00.000Z',
  updatedAt: '2026-10-16T09:00:00.000Z',
};

export const successResponse = (
  statusCode: number,
  message: string,
  data: unknown,
) => ({
  success: true,
  statusCode,
  message,
  data,
});

export const errorResponse = (
  statusCode: number,
  message: string | string[],
) => ({
  success: false,
  statusCode,
  message,
});
