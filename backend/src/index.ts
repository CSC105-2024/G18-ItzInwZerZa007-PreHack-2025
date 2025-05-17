import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import {loadRoutes} from "@/router.js";
import {compress} from 'hono/compress';
import {logger} from 'hono/logger';
import {trimTrailingSlash} from 'hono/trailing-slash';
import {cors} from "hono/cors";
import {jwtMiddleware} from "@/middleware/auth.middleware.js";

const app = new Hono()

app.use(
    "*",
    cors({
      origin: ["http://localhost:5173"],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      maxAge: 86400,
    })
);

app.use(compress());
app.use(trimTrailingSlash());
app.use(logger());
app.use('*', jwtMiddleware);

loadRoutes(app);

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
