import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {  
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create a connection pool for the adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Create Prisma Client with the adapter
const prisma = new PrismaClient({ adapter });

// Handle graceful shutdown in production
if (process.env.NODE_ENV !== 'production') {
  // In development, disconnect on process exit
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
    await pool.end();
  });
}

export { prisma };
