import { from } from "@submodule/core";
import { prismaService } from "./prisma.service";
import { User } from "../prisma/client";

export const todoService = from(prismaService)
  .provide(client => {
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
        }
      })
    }

    return { addTodo, removeTodo, toggleTodo, listTodo }
  })