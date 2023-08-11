import { create } from "@submodule/core"

export const config = create(() => ({
  prisma: {
    db: 'postgresql://postgres@localhost:5432'
  }
}))