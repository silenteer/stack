import { combine } from "@submodule/core";
import { todoService } from "./todo.service";
import { prismaService } from "./prisma.service";
import { userService } from "./user.service";

export const services = combine({
  todo: todoService,
  user: userService,
  prisma: prismaService
})