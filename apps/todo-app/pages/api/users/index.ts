import type { NextApiRequest, NextApiResponse } from 'next'
import { svcs } from '../../../services'

import { z } from "zod"

const schemas = {
  createUser: z.object({
    username: z.string()
  }),
  updateUserRequest: z.object({
    id: z.string(),
    username: z.string(),
    isDeteled: z.boolean().default(false)
  }),
  removeUserRequest: z.object({
    userId: z.string()
  })
}

const handlers = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":  
      await svcs.execute(async ({ userService }) => {
        const createUserData = schemas.createUser.parse(req.body)
        const user = await userService.createUser(createUserData.username)
        res.status(200).json(user)
      })
    case "PUT":
      await svcs.execute(async ({ userService}) => {
        const updateRequest = schemas.updateUserRequest.parse(req.body)
        const updatedUser = await userService.updateUser(updateRequest)
        res.status(200).json(updatedUser)
      })
    case "DELETE":
      await svcs.execute(async ({ userService }) => {
        const removeRequest = schemas.removeUserRequest.parse(req.body)
        await userService.removeUser(removeRequest.userId)
        res.status(200)
      })
    case "GET": 
    default: await svcs.execute(async ({ userService }) => {
      const users = await userService.listUser()
      res.json(users)
    })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse 
) {
  await handlers(req, res)
    .catch(e => {
      res.status(500).json(e)
    })
}