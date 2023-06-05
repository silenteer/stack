import { from } from "@submodule/core"
import { prismaService } from "./prisma.service"

export const userService = from(prismaService)
  .provide(client => {
    const createUser = async (username: string) => {
      return client.user.create({
        data: {
          username
        }
      })
    }

    const removeUser = async (userId: string) => {
      return client.user.updateMany({
        data: {
          isDeteled: true
        },
        where: {
          id: userId,
          isDeteled: false
        }
      })
    }

    const listUser = async () => {
      return client.user.findMany({
        where: {
          isDeteled: false
        }
      })
    }

    const findUser = async (userId: string) => {
      return client.user.findFirst({
        where: {
          id: userId,
          isDeteled: false
        }
      })
    }

    return { createUser, removeUser, listUser, findUser }
  })