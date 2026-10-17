import bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from '../../app.module';
import { ROLES } from '../../common/common.types';
import { User } from '../../user/schemas/userSchema';

const SEED_PASSWORD = '12345678';
const SUBHAM_ID = new Types.ObjectId('6ad34e34bb06671ac38413eb');

async function seedUsers() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  try {
    const userModel = app.get<Model<User>>(getModelToken(User.name));
    const password = await bcrypt.hash(SEED_PASSWORD, 10);

    const result = await userModel.updateOne(
      { email: 'subham@yopmail.com' },
      {
        $set: {
          name: 'Subham',
          password,
          isActive: true,
          isVerified: false,
          roles: [ROLES.USER],
        },
        $setOnInsert: {
          _id: SUBHAM_ID,
          email: 'subham@yopmail.com',
        },
      },
      { upsert: true },
    );

    console.log(
      `Seeded Subham (${result.upsertedCount} created, ${result.modifiedCount} updated).`,
    );
    console.log(`Development password: ${SEED_PASSWORD}`);
  } finally {
    await app.close();
  }
}

seedUsers().catch((error: unknown) => {
  console.error('Failed to seed user:', error);
  process.exitCode = 1;
});
