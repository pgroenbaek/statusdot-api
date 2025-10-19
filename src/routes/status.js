async function todoRoutes(fastify, options) {
  let todos = [
    { id: 1, task: 'Learn Fastify', done: false },
    { id: 2, task: 'Build an API', done: false }
  ];

  // GET all todos
  fastify.get('/', async () => todos);

  // GET single todo
  fastify.get('/:id', async (req, reply) => {
    const todo = todos.find(t => t.id === parseInt(req.params.id));
    if (!todo) return reply.code(404).send({ error: 'Todo not found' });
    return todo;
  });

  // POST new todo
  fastify.post('/', async (req, reply) => {
    const { task } = req.body;
    if (!task) return reply.code(400).send({ error: 'Task is required' });

    const newTodo = { id: Date.now(), task, done: false };
    todos.push(newTodo);
    reply.code(201).send(newTodo);
  });

  // PUT update todo
  fastify.put('/:id', async (req, reply) => {
    const id = parseInt(req.params.id);
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return reply.code(404).send({ error: 'Todo not found' });

    todos[index] = { ...todos[index], ...req.body };
    return todos[index];
  });

  // DELETE todo
  fastify.delete('/:id', async (req, reply) => {
    todos = todos.filter(t => t.id !== parseInt(req.params.id));
    reply.code(204).send();
  });
}

export default todoRoutes;