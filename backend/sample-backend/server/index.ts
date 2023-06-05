import { todoRoutes } from './routes/todo';
import { router } from './trpc';
import { userRoutes } from './routes/user';

export const appRouter = router({
  todo: todoRoutes,
  user: userRoutes
})

export type AppRouter = typeof appRouter;