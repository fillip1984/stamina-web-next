import { adminRouter } from "./routers/admin"
import { authRouter } from "./routers/auth"
import { bloodPressureReadingRouter } from "./routers/blood-pressure-reading"
import { collectionRouter } from "./routers/collection"
import { resultRouter } from "./routers/result"
import { tagRouter } from "./routers/tag"
import { taskRouter } from "./routers/task"
import { weighInRouter } from "./routers/weighIn"
import { createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  bloodPressureReading: bloodPressureReadingRouter,
  collection: collectionRouter,
  result: resultRouter,
  tag: tagRouter,
  task: taskRouter,
  weighIn: weighInRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
