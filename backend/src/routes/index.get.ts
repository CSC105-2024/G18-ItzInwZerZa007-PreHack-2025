import type {Context} from "hono";

export default function (c: Context) {
    return c.json({
        success: true,
        message: 'Welcome to the backend server!',
    })
}