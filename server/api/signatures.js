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
        const signatures = await prisma.signature.findMany()
        return signatures
    }

    if (req.method === 'POST') {
        const user = await getUserFromToken(req)

        const body = await readBody(event)
        const { name, title, email, platformId } = body

        const signature = await prisma.signature.create({
            data: {
                name,
                title,
                email,
                userId: user.id,
                platformId
            }
        })

        return signature
    }

    if (req.method === 'PUT') {
        const user = await getUserFromToken(req)

        const body = await readBody(event)
        const { id, name, title, email } = body

        const signature = await prisma.signature.update({
            where: { id: parseInt(id) },
            data: {
                name,
                title,
                email
            }
        })

        return signature
    }

    if (req.method === 'DELETE') {
        const user = await getUserFromToken(req)

        const body = await readBody(event)
        const { id } = body

        await prisma.signature.delete({
            where: { id: parseInt(id) }
        })

        return { message: 'Signature deleted successfully' }
    }
})
