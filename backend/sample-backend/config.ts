import { create } from "@submodule/core"
export const config = create(() => ({
  prisma: {
    db: 'file:./db.sqlite'
  },
  server: {
    port: 4000
  }
}))