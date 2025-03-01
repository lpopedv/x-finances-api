import { afterAll, describe, it, expect } from 'vitest'
import type { Category } from '~/schemas/category'
import { TestHelpers } from '~/utils/test-helpers'
import { CreateCategoryUseCase } from './create-category-usecase'
import { UpdateCategoryUseCase } from './update-category-usecase'
import { CategoryNotFoundError } from '~/errors/category-not-found-error'

afterAll(async () => await TestHelpers.clearDatabase())

describe('handle', () => {
	it('should be able to update category', async () => {
		const category: Category = {
			title: 'New Category Test',
			description: 'Category for test use case',
		}

		const newCategoryData: Category = {
			title: 'Updated Category Test',
			description: 'Updated category for test use case',
		}

		const newCategory = await CreateCategoryUseCase.handle(category)

		if (newCategory.id === undefined) throw new Error('Category ID not found')

		const { id, title, description } = await UpdateCategoryUseCase.handle(newCategory.id, newCategoryData)

		expect(id).toEqual(newCategory.id)
		expect(title).toEqual(newCategoryData.title)
		expect(description).toEqual(newCategoryData.description)
	})

	it('it should not be able to return the category if it does not exist', async () => {
		const errorCategory: Category = {
			title: 'Error category',
			description: 'Error description',
		}

		await expect(UpdateCategoryUseCase.handle(0, errorCategory)).rejects.toBeInstanceOf(CategoryNotFoundError)
	})
})
