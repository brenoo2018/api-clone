import { app } from './app';
import { scheduled } from './scheduled';
import { queue } from './queue';
import { Bindings } from './types/bindings';

export default {
  async fetch(request: Request, env: Bindings, ctx: ExecutionContext) {
    return await app.fetch(request, env, ctx);
  },
  scheduled,
  queue
};