import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

async function swaggerPlugin(fastify, options) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Fastify Todo API',
        description: 'Simple CRUD API for managing todos',
        version: '1.0.0'
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local server' }
      ]
    }
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    staticCSP: true
  });
}

export default swaggerPlugin;