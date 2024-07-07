import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const authHeader = getHeader(event, 'authorization')
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
        event.context.userId = decoded.userId
    } catch (err) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid token'
        })
    }

    const body = await readBody(event)
    const { email, name, password } = body

    const updatedData = {}
    if (email) updatedData.email = email
    if (name) updatedData.name = name
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10)
        updatedData.password = hashedPassword
    }

    const user = await prisma.user.update({
        where: { id: event.context.userId },
        data: updatedData
    })

    return user
})
