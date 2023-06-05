import { from } from "@submodule/core";
import { protectedProcedure, router } from "../trpc";
import { services } from "@/services";

export const todoRoutes = router({
  list: protectedProcedure.query(async ({ ctx }) => from(services).execute(({ todo }) => {
    return todo.listTodo(ctx.user)
  }))
})