import { PrismaClient, User } from "@stack/prisma"

export const userService = (client: PrismaClient) => {
  const createUser = async (username: string) => {
    return client.user.create({
      data: {
        username
      }
    })
  }

  const updateUser = async (request: User) => {
    const user = await findUser(request.id)

    if (!user) {
      throw new Error('USER NOT FOUND')
    }

    return await client.user.update({
      data: request,
      where: {
        id: request.id
      }
    })
  }

  const removeUser = async (userId: string) => {
    return await client.user.updateMany({
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
      },
      orderBy: {
        id: 'asc'
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

  return { createUser, removeUser, listUser, findUser, updateUser }
}