import { TRPCError, initTRPC } from '@trpc/server';
import { services } from '@/services';
import { z } from "zod"
import { inferAsyncReturnType } from '@trpc/server';
import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

const userIdSchema = z.undefined().or(z.string())

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res };
}
export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC
  .context<Context>()
  .create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const mergeRouters = t.mergeRouters;

const protectFn = t.middleware(async ({ ctx, next }) => {
  const transformResult =  userIdSchema.safeParse(ctx.req.headers['userId'])
  
  if (transformResult.success) {
    const data = transformResult.data
    
    if (data !== undefined) {
      const user = await services.execute(async ({ user }) => {
        return user.findUser(data)
      })

      if (user === undefined) {
        throw new TRPCError({
          code: "FORBIDDEN"
        })
      }

      return next({
        ctx: { user }
      })
    }
  } else {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: "invalid userId format"
    })
  }
})

export const protectedProcedure = t.procedure.use(protectFn);