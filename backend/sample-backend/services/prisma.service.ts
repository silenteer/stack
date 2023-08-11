import { create } from "@submodule/core"
import { config } from "../config"
import { prismaService as svc } from "@stack/prisma"

export const prismaService = create((config) => svc(config.prisma), config)