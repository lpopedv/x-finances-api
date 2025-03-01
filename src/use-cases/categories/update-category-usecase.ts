import { CategoryNotFoundError } from '~/errors/category-not-found-error'
import { prisma } from '~/lib'
import type { Category } from '~/schemas/category'

const handle = async (categoryId: number, category: Category): Promise<Category> => {
	const categoryInDatabase = await prisma.category.findUnique({
		where: {
			id: categoryId,
		},
	})

	if (categoryInDatabase === null) throw new CategoryNotFoundError(categoryId)

	const { title, description } = category

	const updatedCategory = await prisma.category.update({
		where: {
			id: categoryId,
		},
		data: {
			title,
			description,
		},
	})

	return {
		id: updatedCategory.id,
		title: updatedCategory.title,
		description: updatedCategory.description ?? undefined,
	}
}

export const UpdateCategoryUseCase = {
	handle,
}
