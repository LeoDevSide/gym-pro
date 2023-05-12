import 'dotenv/config'
import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { Environment } from 'vitest'
import { prisma } from '../../src/lib/prisma'

// postgresql://docker:docker@localhost:5432/apigym?schema=public
function generateDbURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable')
  }
  const url = new URL(process.env.DATABASE_URL)
  url.searchParams.set('schema', schema)
  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  async setup() {
    const schema = randomUUID()
    const dbURL = generateDbURL(schema)

    process.env.DATABASE_URL = dbURL
    execSync('npx prisma migrate deploy') // deploy skips schema comparison, is faster than dev

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema} CASCADE"`,
        )
        await prisma.$disconnect()
      },
    }
  },
}
