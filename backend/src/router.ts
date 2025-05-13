import { type Env, Hono } from "hono";
import fs from 'fs'
import path from 'path'
import process from 'process'

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

export function loadRoutes<T extends Env>(app: Hono<T>): void {
    const routesDir = path.join(process.cwd(), 'src', 'routes')

    if (!fs.existsSync(routesDir)) {
        console.error('Routes directory not found:', routesDir)
        return
    }

    walkRoutes<T>(app, routesDir, '')
}

function walkRoutes<T extends Env>(app: Hono<T>, baseDir: string, currentPath: string): void {
    const routesDir = path.join(baseDir, currentPath)
    const files = fs.readdirSync(routesDir)

    files.forEach(file => {
        const filePath = path.join(routesDir, file)
        const stats = fs.statSync(filePath)

        if (stats.isDirectory()) {
            walkRoutes<T>(app, baseDir, path.join(currentPath, file))
        } else if (stats.isFile() && file.endsWith('.ts')) {
            registerRoute<T>(app, baseDir, path.join(currentPath, file))
        }
    })
}

async function registerRoute<T extends Env>(app: Hono<T>, baseDir: string, routeFile: string): Promise<void> {
    const { routePath, method } = parseRoutePath(routeFile)

    if (!method) {
        console.warn(`Skipping file with no HTTP method: ${routeFile}`)
        return
    }

    const fullPath = path.join(baseDir, routeFile)

    try {
        const fileUrl = pathToFileURL(fullPath)

        const module = await import(fileUrl)
        const handler = module.default

        if (typeof handler !== 'function') {
            console.error(`Invalid route handler in ${routeFile}. Export a default function.`)
            return
        }

        console.log(`\x1b[46m[Router]\x1b[0m \x1b[37m${method.toUpperCase()}\x1b[0m \t ${routePath}`)

        switch (method) {
            case 'get':
                app.get(routePath, handler)
                break
            case 'post':
                app.post(routePath, handler)
                break
            case 'put':
                app.put(routePath, handler)
                break
            case 'delete':
                app.delete(routePath, handler)
                break
            case 'patch':
                app.patch(routePath, handler)
                break
            case 'options':
                app.options(routePath, handler)
                break
            case 'head':
                app.get(routePath, handler)
                break
        }
    } catch (err) {
        console.error(`\x1b[31m[Router Error]\x1b[0m Error loading route ${routeFile}:`, err)
    }
}

function pathToFileURL(filePath: string): string {
    const absolutePath = path.resolve(filePath)

    const normalizedPath = absolutePath.replace(/\\/g, '/')

    if (process.platform === 'win32') {
        return `file:///${normalizedPath}`
    }

    return `file://${normalizedPath}`
}

function parseRoutePath(filePath: string): { routePath: string, method: HttpMethod | null } {
    let routePath = filePath.replace(/\.ts$/, '')

    const methodMatch = routePath.match(/\.(get|post|put|delete|patch|options|head)$/)
    const method = methodMatch ? methodMatch[1] as HttpMethod : null

    if (method) {
        routePath = routePath.replace(`.${method}`, '')
    }

    routePath = routePath.replace(/\\/g, '/')

    routePath = routePath.replace(/\[([^\]]+)\]/g, ':$1')

    if (routePath === 'index' || routePath === '/index') {
        return { routePath: '/', method }
    }

    if (routePath.endsWith('/index')) {
        routePath = routePath.replace(/\/index$/, '')
    }

    if (!routePath.startsWith('/')) {
        routePath = '/' + routePath
    }

    return { routePath, method }
}