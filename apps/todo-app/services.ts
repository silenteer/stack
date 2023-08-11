import { config } from "./config";
import { prismaService as prismaSvc } from "@stack/prisma";
import { todoService as todoSvc, userService as userSvc } from "@stack/services";
import { create, combine } from "@submodule/core"

export const prismaService = create((config) => prismaSvc(config.prisma), config)
export const todoService = create(todoSvc, prismaService)
export const userService = create(userSvc, prismaService)
export const svcs = combine({ prismaService, todoService, userService })