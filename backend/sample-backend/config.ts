import { create } from "@submodule/core"
export const config = create(() => ({
  prisma: {
    db: 'file:./dev.sqlite'
  },
  server: {
    port: 4000
  }
}))