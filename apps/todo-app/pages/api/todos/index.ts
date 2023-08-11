import type { NextApiRequest, NextApiResponse } from 'next'
import { svcs } from '../../../services'
import { z } from "zod" 

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

const handlers = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":  
      await svcs.execute(async ({ userService, todoService }) => {
        const createTodoData = schemas.createTodo.parse(req.body)

        const user = await userService.findUser(createTodoData.userId)
        if (!user) {
          res.status(400).send("invalid user")
          return
        }

        const todo = await todoService.addTodo(user, createTodoData.content)
        res.status(200).json(todo)
      })
    case "PUT":
      await svcs.execute(async ({ todoService, userService }) => {
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
        res.status(200).json(response)
      })
    case "GET": 
    default: await svcs.execute(async ({ userService, todoService }) => {
      const getTodosData = schemas.getTodos.parse(req.query)

      const user = await userService.findUser(getTodosData.userId)
      if (!user) {
        res.status(400).send("invalid user")
        return
      }

      const todos = await todoService.listTodo(user)
      res.json(todos)
    })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse 
) {
  await handlers(req, res)
    .catch(e => {
      res.status(500).end()
    })
}