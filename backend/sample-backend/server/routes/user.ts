import { from } from "@submodule/core";
import { publicProcedure, router } from "../trpc";
import { services } from "../../services";
import { z } from "zod"

export const userRoutes = router({
  list: publicProcedure.query(
    services.prepare(({ user }) => { return user.listUser() }
  )),

  add: publicProcedure
    .input(z.object({
      username: z.string()
    }))
    .mutation(
      services.prepare(({ user }, { input }) => { return user.createUser(input.username)}
    ))
})