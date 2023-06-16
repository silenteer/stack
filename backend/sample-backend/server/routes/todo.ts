import { protectedProcedure, router } from "../trpc";
import { services } from "../../services";

export const todoRoutes = router({
  list: protectedProcedure.query(services.prepare(({ todo }, { ctx }) => {
    return todo.listTodo(ctx.user)
  }))
})