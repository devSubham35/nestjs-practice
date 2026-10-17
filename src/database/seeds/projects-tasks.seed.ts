import { Model } from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../../app.module';
import { Project, ProjectDocument } from '../../project/schemas/project.schema';
import { PROJECT_STATUS } from '../../project/project.types';
import { Task } from '../../task/schemas/task.schema';
import { TASK_PRIORITY, TASK_STATUS } from '../../task/task.types';
import { User } from '../../user/schemas/userSchema';

const SUBHAM_EMAIL = 'subham@yopmail.com';

function daysFromNow(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

async function seedProjectsAndTasks() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const projectModel = app.get<Model<Project>>(getModelToken(Project.name));
    const taskModel = app.get<Model<Task>>(getModelToken(Task.name));

    const subham = await userModel.findOne({ email: SUBHAM_EMAIL }).exec();

    if (!subham) {
      throw new Error(
        `User ${SUBHAM_EMAIL} was not found. Run "npm run seed:users" first.`,
      );
    }

    const projectSeeds = [
      {
        key: 'taskflow',
        name: 'TaskFlow Web Application',
        description: 'Build and polish the TaskFlow project management app.',
      },
      {
        key: 'marketing',
        name: 'Marketing Website',
        description: 'Launch a responsive website for product marketing.',
      },
      {
        key: 'personal',
        name: 'Personal Development Plan',
        description: 'Track learning goals and professional development.',
      },
    ];

    const projects = new Map<string, ProjectDocument>();

    for (const seed of projectSeeds) {
      const project = await projectModel.findOneAndUpdate(
        { name: seed.name, ownerId: subham._id },
        {
          $set: {
            name: seed.name,
            description: seed.description,
            ownerId: subham._id,
            members: [subham._id],
            status: PROJECT_STATUS.ACTIVE,
            isDeleted: false,
          },
        },
        { returnDocument: 'after', upsert: true, runValidators: true },
      );

      projects.set(seed.key, project);
    }

    const taskSeeds = [
      {
        taskId: 'SEED-SUBHAM-001',
        title: 'Complete authentication flow',
        description: 'Finish login, registration, and profile handling.',
        projectId: projects.get('taskflow')!._id,
        status: TASK_STATUS.COMPLETED,
        priority: TASK_PRIORITY.HIGH,
        dueDate: daysFromNow(-2),
      },
      {
        taskId: 'SEED-SUBHAM-002',
        title: 'Build project dashboard',
        description: 'Display project cards, filters, and summary counts.',
        projectId: projects.get('taskflow')!._id,
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.HIGH,
        dueDate: daysFromNow(3),
      },
      {
        taskId: 'SEED-SUBHAM-003',
        title: 'Add task drag and drop',
        description: 'Allow tasks to move between workflow status columns.',
        projectId: projects.get('taskflow')!._id,
        status: TASK_STATUS.BACKLOG,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: daysFromNow(10),
      },
      {
        taskId: 'SEED-SUBHAM-004',
        title: 'Design responsive homepage',
        description: 'Create desktop, tablet, and mobile homepage layouts.',
        projectId: projects.get('marketing')!._id,
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.HIGH,
        dueDate: daysFromNow(4),
      },
      {
        taskId: 'SEED-SUBHAM-005',
        title: 'Write product feature copy',
        description:
          'Prepare concise content for the product features section.',
        projectId: projects.get('marketing')!._id,
        status: TASK_STATUS.PENDING,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: daysFromNow(7),
      },
      {
        taskId: 'SEED-SUBHAM-006',
        title: 'Optimize website assets',
        description: 'Compress images and improve page loading performance.',
        projectId: projects.get('marketing')!._id,
        status: TASK_STATUS.COMPLETED,
        priority: TASK_PRIORITY.LOW,
        dueDate: daysFromNow(-1),
      },
      {
        taskId: 'SEED-SUBHAM-007',
        title: 'Complete NestJS advanced course',
        description: 'Finish the remaining modules and practice exercises.',
        projectId: projects.get('personal')!._id,
        status: TASK_STATUS.IN_PROGRESS,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: daysFromNow(14),
      },
      {
        taskId: 'SEED-SUBHAM-008',
        title: 'Review monthly learning goals',
        description: 'Evaluate progress and plan the next set of topics.',
        projectId: projects.get('personal')!._id,
        status: TASK_STATUS.PENDING,
        priority: TASK_PRIORITY.LOW,
        dueDate: daysFromNow(21),
      },
    ].map((task) => ({
      ...task,
      createdBy: subham._id,
      assignedTo: [subham._id],
    }));

    const result = await taskModel.bulkWrite(
      taskSeeds.map((task) => ({
        updateOne: {
          filter: { taskId: task.taskId },
          update: { $set: task },
          upsert: true,
        },
      })),
    );

    console.log(`Seeded ${projectSeeds.length} projects for ${SUBHAM_EMAIL}.`);
    console.log(
      `Seeded ${taskSeeds.length} tasks (${result.upsertedCount} created, ${result.modifiedCount} updated).`,
    );
  } finally {
    await app.close();
  }
}

seedProjectsAndTasks().catch((error: unknown) => {
  console.error('Failed to seed projects and tasks:', error);
  process.exitCode = 1;
});
