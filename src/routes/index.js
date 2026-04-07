import { getStatus } from '../controllers/getStatus.js';
import { setStatus } from '../controllers/setStatus.js';
import { info } from '../controllers/info.js';
import { requireApiKey } from '../middlewares/auth.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  switch (path) {
    case '/value':
      if (request.method === 'GET') return getStatus(env);
      if (request.method === 'POST') {
        const authError = requireApiKey(request, env);
        if (authError) return authError;
        return setStatus(env, request);
      }
      break;

    case '/info':
      if (request.method === 'GET') return info();
      break;

    default:
      return new Response(JSON.stringify({ error: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}