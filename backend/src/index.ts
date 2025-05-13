import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {loadRoutes} from "@/router.js";
import {compress} from 'hono/compress';
import {logger} from 'hono/logger';
import {trimTrailingSlash} from 'hono/trailing-slash';

const app = new Hono()

app.use(compress());
app.use(trimTrailingSlash());
app.use(logger());

loadRoutes(app);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
