import z from "zod";
import { FastifyTypedInstance } from "./types";
import { Category, categoryZodSchema, Transaction, transactionZodSchema } from "./schemas";
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
      tags: ['transactions'],
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
      date: transaction.date.toISOString(),
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
      tags: ['transactions'],
      description: 'Create a new transaction',
      body: transactionZodSchema,
      response: {
        201: z.null().describe('Transaction created'),
        400: z.object({
          message: z.string()
        }).describe('Error message')
      }
    }
  }, async (request, reply) => {
    const { categoryId, title, movement, valueInCents, date, isFixed, isPaid, category } = request.body;

    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (categoryExists === null) return reply.status(400).send({ message: 'Category not found' });

    await prisma.transaction.create({
      data: {
        categoryId,
        title,
        movement,
        valueInCents,
        date,
        isFixed,
        isPaid
      }
    });

    return reply.status(201).send();
  });
};
