import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClientSingleton = () => {
  const prisma = new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  });

  // Test MongoDB connection
  prisma.$connect()
  .then(() => {
    console.log('✅ Connected to MongoDB via Prisma');
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.error('❌ MongoDB connection error:', error.message);
    } else {
      console.error('❌ Unknown MongoDB connection error:', error);
    }
    throw error;
  });

  return prisma;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
