import { fastify } from 'fastify'
import { fastifyCors } from '@fastify/cors'
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
	type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { routes } from './routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Set the compiler for the serializers and validators (using Zod)
app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: '*' })

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'xFinances',
			version: '1.0.0',
		},
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, { routePrefix: '/docs' })

app.register(routes)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => console.log('🚀 Server is running on: http://localhost:3333'))
