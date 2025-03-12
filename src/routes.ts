import z from 'zod'
import { categoryZodSchema } from '~/schemas/category'
import type { FastifyTypedInstance } from './types'
import { ListCategoriesUseCase } from './use-cases/categories/list-categories-usecase'
import { CreateCategoryUseCase } from './use-cases/categories/create-category-usecase'
import { UpdateCategoryUseCase } from './use-cases/categories/update-category-usecase'
import { CategoryNotFoundError } from './errors/category-not-found-error'
import { transactionZodSchema } from './schemas/transaction'
import { CreateTransactionUseCase } from './use-cases/transactions/create-transaction-usecase'
import { ListTransactionsUseCase } from './use-cases/transactions/list-transactions-usecase'
import { type DashboardData, dashboardZodSchema } from './schemas'
import { prisma } from './database/prisma-client'
import { GetChartsDataUseCase } from './use-cases/charts/get-charts-data-usecase'
import { chartsZodSchema } from './schemas/charts'
import { UpdateTransactionUseCase } from './use-cases/transactions/update-transaction-usecase'

export const routes = (app: FastifyTypedInstance) => {
	app.get(
		'/categories',
		{
			schema: {
				tags: ['Categories'],
				description: 'List all categories',
				response: {
					200: z.array(categoryZodSchema).describe('List of categories'),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (_request, reply) => {
			try {
				const categories = await ListCategoriesUseCase.handle()
				return reply.status(200).send(categories)
			} catch (error) {
				console.error(error)
				return reply.status(500).send({
					message: 'Internal Server Error',
				})
			}
		},
	)

	app.post(
		'/categories',
		{
			schema: {
				tags: ['Categories'],
				description: 'Create a new category',
				body: categoryZodSchema,
				response: {
					201: categoryZodSchema,
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const newCategoryData = request.body

			try {
				const newCategory = await CreateCategoryUseCase.handle(newCategoryData)
				return reply.status(201).send(newCategory)
			} catch (error) {
				console.error(error)
				return reply.status(500).send({
					message: 'Internal Server Error',
				})
			}
		},
	)

	app.put(
		'/categories/:id',
		{
			schema: {
				tags: ['Categories'],
				description: 'Update a category',
				body: categoryZodSchema,
				params: z.object({ id: z.string() }),
				response: {
					200: categoryZodSchema,
					404: z.object({ message: z.string() }),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			try {
				const newCategoryData = request.body
				const categoryId = request.params.id

				const updatedCategory = await UpdateCategoryUseCase.handle(Number(categoryId), newCategoryData)

				return reply.status(200).send(updatedCategory)
			} catch (error) {
				if (error instanceof CategoryNotFoundError) {
					return reply.status(404).send({ message: error.message })
				}

				return reply.status(500).send({ message: 'Internal Server Error' })
			}
		},
	)

	app.get(
		'/transactions',
		{
			schema: {
				tags: ['Transactions'],
				description: 'List all transactions',
				response: {
					200: z.array(transactionZodSchema).describe('List of transactions'),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (_request, reply) => {
			try {
				const transactions = await ListTransactionsUseCase.handle()
				return reply.status(200).send(transactions)
			} catch (error) {
				console.error(error)
				return reply.status(500).send({
					message: 'Internal Server Error',
				})
			}
		},
	)

	app.post(
		'/transactions',
		{
			schema: {
				tags: ['Transactions'],
				description: 'Create a new transaction',
				body: transactionZodSchema,
				response: {
					201: transactionZodSchema,
					404: z
						.object({
							message: z.string(),
						})
						.describe('Error message'),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const newTransactionData = request.body

			try {
				const newTransaction = await CreateTransactionUseCase.handle(newTransactionData)
				return reply.status(201).send(newTransaction)
			} catch (error) {
				console.error(error)

				if (error instanceof CategoryNotFoundError) {
					return reply.status(404).send({ message: error.message })
				}

				return reply.status(500).send({ message: 'Internal Server Error' })
			}
		},
	)

	app.put(
		'/transactions',
		{
			schema: {
				tags: ['Transactions'],
				description: 'Update a transaction',
				body: transactionZodSchema,
				response: {
					201: transactionZodSchema,
					404: z
						.object({
							message: z.string(),
						})
						.describe('Error message'),
					500: z.object({ message: z.string() }),
				},
			},
		},
		async (request, reply) => {
			const newTransactionData = request.body

			try {
				const updatedTransaction = await UpdateTransactionUseCase.handle(newTransactionData)
				return reply.status(201).send(updatedTransaction)
			} catch (error) {
				console.error(error)

				if (error instanceof CategoryNotFoundError) {
					return reply.status(404).send({ message: error.message })
				}

				return reply.status(500).send({ message: 'Internal Server Error' })
			}
		},
	)

	app.get(
		'/dashboard-data',
		{
			schema: {
				tags: ['Dashboard'],
				description: 'Dashboard data with all statics',
				response: {
					200: dashboardZodSchema,
				},
			},
		},
		async (_request, reply) => {
			const totalFixedExpensesQueryResult = await prisma.transaction.findMany({
				where: {
					isFixed: true,
					movement: 'outgoing',
				},
			})

			const totalFixedExpenses = totalFixedExpensesQueryResult.reduce(
				(total, expense) => total + expense.valueInCents,
				0,
			)

			const dashboardData: DashboardData = {
				totalFixedExpenses,
			}

			return reply.status(200).send(dashboardData)
		},
	)

	app.get(
		'/charts-data',
		{
			schema: {
				tags: ['Charts Data'],
				description: 'All charts data',
				response: {
					200: chartsZodSchema,
				},
			},
		},
		async (_request, reply) => {
			const chartsData = await GetChartsDataUseCase.handle()
			return reply.status(200).send(chartsData)
		},
	)
}
