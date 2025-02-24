import z from "zod";
import { FastifyTypedInstance } from "./types";
import { Category, categoryZodSchema, DashboardData, dashboardZodSchema, Transaction, transactionZodSchema } from "./schemas";
import { prisma } from "./lib";

export const routes = (app: FastifyTypedInstance) => {
  app.get('/categories', {
    schema: {
      tags: ['categories'],
      description: 'List all categories',
      response: {
        200: z.array(categoryZodSchema).describe('List of categories')
      }
    }
  }, async (_request, reply) => {
    const databaseCategories = await prisma.category.findMany();

    const parsedCategories = databaseCategories.map((category): Category => ({
      id: category.id ?? undefined,
      title: category.title,
      description: category.description ?? undefined
    }));

    return reply.status(200).send(parsedCategories);
  });

  app.post('/categories', {
    schema: {
      tags: ['createCategory'],
      description: 'Create a new category',
      body: categoryZodSchema,
      response: {
        201: categoryZodSchema
      }
    }
  }, async (request, reply) => {
    const { title, description } = request.body;

    const newCategory = await prisma.category.create({
      data: {
        title,
        description
      }
    });

    return reply.status(201).send({
      title: newCategory.title,
      description: newCategory.description ?? undefined,
      id: newCategory.id
    });
  });

  app.put('/categories/:id', {
    schema: {
      tags: ['updateCategory'],
      description: 'Update a category',
      body: categoryZodSchema,
      response: {
        200: categoryZodSchema
      }
    },
  }, async (request, reply) => {
    const { id, title, description } = request.body;

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        title,
        description
      }
    });

    return reply.status(200).send({
      title: updatedCategory.title,
      description: updatedCategory.description ?? undefined,
      id: updatedCategory.id
    });	
  })

  app.get('/transactions', {
    schema: {
      tags: ['transactionsList'],
      description: 'List all transactions',
      response: {
        200: z.array(transactionZodSchema).describe('List of transactions')
      }
    }
  }, async (_request, reply) => {
    const databaseTransactions = await prisma.transaction.findMany({
      include: {
        category: true
      }
    });

    const parsedTransactions = databaseTransactions.map((transaction): Transaction => ({
      id: transaction.id ?? undefined,
      categoryId: transaction.categoryId,
      title: transaction.title,
      movement: transaction.movement as 'income' | 'outgoing',
      isFixed: transaction.isFixed,
      isPaid: transaction.isPaid,
      date: transaction?.date?.toISOString() ?? undefined,
      valueInCents: transaction.valueInCents,
      category: {
        id: transaction.category.id,
        title: transaction.category.title,
        description: transaction.category.description ?? undefined
      }
    }));

    return reply.status(200).send(parsedTransactions);
  });

  app.post('/transactions', {
    schema: {
      tags: ['transactionCreation'],
      description: 'Create a new transaction',
      body: transactionZodSchema,
      response: {
        201: transactionZodSchema,
        400: z.object({
          message: z.string()
        }).describe('Error message')
      }
    }
  }, async (request, reply) => {
    const { categoryId, title, movement, valueInCents, date, isFixed, isPaid } = request.body;

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (categoryExists === null) return reply.status(400).send({ message: 'Category not found' });

    const newTransaction = await prisma.transaction.create({
      data: {
        categoryId,
        title,
        movement,
        valueInCents,
        date: date ? new Date(date) : undefined,
        isFixed,
        isPaid
      }
    });

    return reply.status(201).send({
      categoryId: newTransaction.categoryId,
      title: newTransaction.title,
      movement: newTransaction.movement as 'income' | 'outgoing',
      valueInCents: newTransaction.valueInCents,
      date: newTransaction?.date?.toISOString(),
    });
  });

  app.get('/dashboard-data', {
    schema: {
      tags: ['dashboardData'],
      description: 'Dashboard data with all statics',
      response: {
        200: dashboardZodSchema
      }
    }
  } ,async (_request, reply) => {
    const totalFixedExpensesQueryResult = await prisma.transaction.findMany({
      where: {
        isFixed: true,
        movement: 'outgoing'
      }
    })

    const totalFixedExpenses = totalFixedExpensesQueryResult.reduce((total, expense) => total + expense.valueInCents, 0)
    
    const dashboardData: DashboardData = {
      totalFixedExpenses
    }

    return reply.status(200).send(dashboardData)
  })
};
