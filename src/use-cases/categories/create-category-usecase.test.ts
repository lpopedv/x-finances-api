import { afterAll, describe, it, expect } from 'vitest'
import { Category } from '~/schemas/category'
import { TestHelpers } from '~/utils/test-helpers'
import { CreateCategoryUseCase } from './create-category-usecase'

afterAll(async () => await TestHelpers.clearDatabase())

describe('handle', () => {
	it('should be able to create a new category', async () => {
		const newCategoryData: Category = {
			title: 'New Category Test',
			description: 'Category for test use case',
		}

		const { id, title, description } = await CreateCategoryUseCase.handle(newCategoryData)

		expect(id).toBeDefined()
		expect(title).toEqual(newCategoryData.title)
		expect(description).toEqual(newCategoryData.description)
	})
})
