import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from "zod"
import { createRoute } from '../../../rest'

const schemas = {
  createTodo: z.object({
    userId: z.string(),
    content: z.string()
  }),
  getTodos: z.object({
    userId: z.string().nonempty()
  }),
  updateTodoRequest: z.object({
    userId: z.string(),
    todoId: z.string(),
    done: z.boolean().optional(),
    content: z.string().optional()
  })
}

export default createRoute(async ({ userService, todoService }, req, res) => {
  switch (req.method) {
    case "POST": {
      const createTodoData = schemas.createTodo.parse(req.body)

      const user = await userService.findUser(createTodoData.userId)
      if (!user) {
        res.status(400).send("invalid user")
        return
      }

      const todo = await todoService.addTodo(user, createTodoData.content)
      return res.status(200).json(todo)
    }
    case "PUT": {
      const updateTodoRequest = schemas.updateTodoRequest.parse(req.body)

      const user = await userService.findUser(updateTodoRequest.userId)
      if (!user) {
        res.status(400).send("invalid user")
        return
      }

      const todo = await todoService.getTodo(user, updateTodoRequest.todoId)
      if (updateTodoRequest.done !== undefined) {
        todo.done = updateTodoRequest.done
      }

      if (updateTodoRequest.content !== undefined) {
        todo.content = updateTodoRequest.content
      }

      const response = await todoService.updateTodo(user, todo)
      return res.status(200).json(response)
    }
    case "GET":
    default: {
      const getTodosData = schemas.getTodos.parse(req.query)

      const user = await userService.findUser(getTodosData.userId)
      if (!user) {
        res.status(400).send("invalid user")
        return
      }

      const todos = await todoService.listTodo(user)
      return res.json(todos)
    }
  }
})