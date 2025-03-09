import { prisma } from '~/database/prisma-client'
import type { Category } from '~/schemas/category'

const handle = async (): Promise<Category[]> => {
	const databaseCategories = await prisma.category.findMany()

	const parsedCategories = databaseCategories.map(
		(category): Category => ({
			id: category.id,
			title: category.title,
			description: category.description ?? undefined,
		}),
	)

	return parsedCategories
}

export const ListCategoriesUseCase = {
	handle,
}
