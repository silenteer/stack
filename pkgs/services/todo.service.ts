import { PrismaClient, Todo, User } from "@stack/prisma";

export const todoService = (client: PrismaClient) => {
  const addTodo = async (user: User, content: string) => {
    return client.todo.create({
      data: {
        content,
        userId: user.id
      },
    })
  }

  const removeTodo = async (user: User, todoId: string) => {
    return client.todo.updateMany({
      data: {
        isDeteled: true
      },
      where: {
        id: todoId,
        userId: user.id,
        isDeteled: false
      }
    })
  }

  const updateTodo = async (user: User, updatingTodo: Todo) => {
    return client.todo.update({
      data: {
        content: updatingTodo.content,
        done: updatingTodo.done
      },
      where: {
        id: updatingTodo.id,
        user
      }
    })
  }

  const toggleTodo = async (user: User, todoId: string, nextState: boolean) => {
    return client.todo.updateMany({
      data: {
        done: nextState
      },
      where: {
        id: todoId,
        userId: user.id,
        isDeteled: false
      }
    })
  }

  const listTodo = async (user: User) => {
    return client.todo.findMany({
      where: {
        userId: user.id,
        isDeteled: false
      },
      orderBy: {
        id: 'desc'
      }
    })
  }

  const getTodo = async (user: User, todoId: string) => {
    return client.todo.findFirstOrThrow({
      where: {
        user,
        id: todoId
      }
    })
  }

  return { addTodo, updateTodo, getTodo, removeTodo, toggleTodo, listTodo }
}