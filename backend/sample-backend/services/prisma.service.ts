import { create } from "@submodule/core"
import { PrismaClient } from "../prisma/client"
import { config } from "../config"

export const prismaService = create((config) => new PrismaClient({
  datasources: {
    db: { url: config.prisma.db }
  }
}), config)