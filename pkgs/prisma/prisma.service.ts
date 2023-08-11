import { PrismaClient } from "./prisma/client"

export type PrismaConfig = {
  db: string
}

export const prismaService = (config: PrismaConfig) => {
  return new PrismaClient({
    datasources: {
      db: { url: config.db }
    }
  })
}

export type { Todo, User, PrismaClient } from "./prisma/client"