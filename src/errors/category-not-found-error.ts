export class CategoryNotFoundError extends Error {
	constructor(categoryId: number) {
		super(`A categoria de ID ${categoryId} não existe`)
	}
}
