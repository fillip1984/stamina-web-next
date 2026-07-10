import { adminRouter } from "./routers/admin"
import { authRouter } from "./routers/auth"
import { collectionRouter } from "./routers/collection"
import { taskRouter } from "./routers/task"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  auth: authRouter,
  admin: adminRouter,
  collection: collectionRouter,
  task: taskRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
