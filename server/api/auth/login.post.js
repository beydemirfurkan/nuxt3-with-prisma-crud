import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const { email, password } = body

    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password'
        })
    }

    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' })

    return { token }
})
