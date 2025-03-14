import { prisma } from '~/database/prisma-client'
import type { Category } from '~/schemas/category'

const handle = async (category: Category): Promise<Category> => {
	const { title, description } = category

	const newCategory = await prisma.category.create({
		data: {
			title,
			description,
		},
	})

	return {
		id: newCategory.id,
		title: newCategory.title,
		description: newCategory.description ?? undefined,
	}
}

export const CreateCategoryUseCase = {
	handle,
}
