import { handleRequest } from './routes/index.js';

export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  },
};