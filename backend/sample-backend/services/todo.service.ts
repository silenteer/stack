import { create } from "@submodule/core";
import { todoService as svc } from "@stack/services";
import { prismaService } from "./prisma.service";

export const todoService = create(svc, prismaService)