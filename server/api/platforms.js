import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

const getUserFromToken = async (req) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Authorization header missing'
        })
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Token missing'
        })
    }

    try {
        const decoded = jwt.verify(token, 'your-secret-key')
        const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid token'
            })
        }

        return user
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid token'
        })
    }
}

export default defineEventHandler(async (event) => {
    const { req, res } = event

    if (req.method === 'GET') {
        const platforms = await prisma.platform.findMany()
        return platforms
    }

    if (req.method === 'POST') {
        const user = await getUserFromToken(req)
        const body = await readBody(event)
        const { name, logoUrl, number, email } = body

        const platform = await prisma.platform.create({
            data: {
                name,
                logoUrl,
                number,
                email
            }
        })

        return platform
    }

    if (req.method === 'PUT') {
        const user = await getUserFromToken(req)
        const body = await readBody(event)
        const { id, name, logoUrl, number, email } = body

        const platform = await prisma.platform.update({
            where: { id: parseInt(id) },
            data: {
                name,
                logoUrl,
                number,
                email
            }
        })

        return platform
    }

    if (req.method === 'DELETE') {
        const user = await getUserFromToken(req)
        const body = await readBody(event)
        const { id } = body

        await prisma.platform.delete({
            where: { id: parseInt(id) }
        })

        return { message: 'Platform deleted successfully' }
    }
})
