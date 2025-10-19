import Fastify from 'fastify';
import todoRoutes from './routes/status.js';
import swaggerPlugin from './plugins/swagger.js';

const fastify = Fastify({
  logger: true
});

// Register plugins
await fastify.register(swaggerPlugin);

// Register routes
await fastify.register(todoRoutes, { prefix: '/todos' });

// Root route
fastify.get('/', async () => ({ message: 'Welcome to Fastify Todo API!' }));

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('🚀 Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();