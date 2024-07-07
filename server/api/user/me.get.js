import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = event.req.headers['authorization']
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
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: {
                signatures: {
                    include: {
                        platform: true
                    }
                }
            }
        })

        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid token'
            })
        }

        const platforms = user.signatures.map(signature => signature.platform)

        return {
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            platforms,
            signatures: user.signatures
        }
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid token'
        })
    }
})
