import { from } from "@submodule/core";
import { publicProcedure, router } from "../trpc";
import { services } from "@/services";
import { z } from "zod"

export const userRoutes = router({
  list: publicProcedure.query(async ({ ctx }) => from(services).execute(({ user }) => {
    return user.listUser()
  })),

  add: publicProcedure
    .input(z.object({ 
      username: z.string()
    }))
    .mutation(async ({ input }) => {
      return services.execute(({ user }) => {
        user.createUser(input.username)
      })
    })
})