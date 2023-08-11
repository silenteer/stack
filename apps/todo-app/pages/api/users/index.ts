import type { NextApiRequest, NextApiResponse } from 'next'
import { userService } from '../../../services'

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

const handlers = userService.prepare(async (userService, req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case "POST":
      const createUserData = schemas.createUser.parse(req.body)
      const user = await userService.createUser(createUserData.username)
      return res.status(200).json(user)
    case "PUT":
      const updateRequest = schemas.updateUserRequest.parse(req.body)
      const updatedUser = await userService.updateUser(updateRequest)
      return res.status(200).json(updatedUser)
    case "DELETE":
      const removeRequest = schemas.removeUserRequest.parse(req.body)
      await userService.removeUser(removeRequest.userId)
      return res.status(200)
    case "GET":
    default:
      const users = await userService.listUser()
      return res.json(users)
  }
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await handlers(req, res)
    .catch(e => {
      res.status(500).json(e)
    })
}