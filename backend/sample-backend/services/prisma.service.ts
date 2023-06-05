import { from } from "@submodule/core"
import { PrismaClient } from "@/prisma/client"
import { config } from "@/config"

export const prismaService = from(config)
  .provide((config) => new PrismaClient({
    datasources: {
      db: { url: config.prisma.db }
    }
  }))