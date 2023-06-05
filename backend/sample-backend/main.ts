import { from } from "@submodule/core"
import { config } from "./config"

import { CreateFastifyContextOptions, fastifyTRPCPlugin } from '@trpc/server/adapters/fastify'
import fastify from "fastify"
import ws from '@fastify/websocket'
import { appRouter } from "./server"

function createContext({ req, res }: CreateFastifyContextOptions) {
  return { req, res };
}

from(config).execute(async config => {
  const server = fastify({
    // server param
  })

  server.register(ws)

  server.register(fastifyTRPCPlugin, {
    prefix: '/rpc',
    trpcOptions: { 
      router: appRouter,
      createContext
    }
  })

  await server.listen({ 
    port: config.server.port
  })

  console.log('server is listening at port', config.server.port)
})