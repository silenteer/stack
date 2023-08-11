import { create } from "@submodule/core"
import { prismaService } from "./prisma.service"
import { userService as svc } from "@stack/services"

export const userService = create(svc, prismaService)