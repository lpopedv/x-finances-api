import { prisma } from '~/database/prisma-client'

const clearDatabase = async (): Promise<void> => {
	try {
		const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  `

		const tables = tablenames
			.map(({ tablename }) => tablename)
			.filter((name) => name !== '_prisma_migrations')
			.map((name) => `"public"."${name}"`)
			.join(', ')

		await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tables} CASCADE;`)
		await prisma.$disconnect()
	} catch (error) {
		console.error({ error })
	}
}

export const TestHelpers = {
	clearDatabase,
}
