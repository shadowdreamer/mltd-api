import { app, asyncCardsJson } from './matsuri'
import type { Env } from './matsuri'

async function handleFetch(req: Request, env: Env, ctx: ExecutionContext) {
  return app.fetch(req, env, ctx)
}

async function scheduled(event: ScheduledController, env: Env, ctx: ExecutionContext) {
  ctx.waitUntil((async () => {
    const msg = await asyncCardsJson(env)
    console.log('[scheduled] ' + msg)
  })())
}

export default {
  fetch: handleFetch,
  scheduled,
}
