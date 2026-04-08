/*
 * This file is part of Statusdot API.
 *
 * Copyright (C) 2026 Peter Grønbæk Andersen <peter@grnbk.io>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

import { getStatus } from '../controllers/getStatus.js';
import { getStatusSvg } from '../controllers/getStatusSvg.js';
import { setStatus } from '../controllers/setStatus.js';
import { requireApiKey } from '../middlewares/auth.js';
import { handleCors } from '../middlewares/cors.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  const cors = handleCors(request);
  
  if (cors instanceof Response) {
    return cors;
  }

  const responseHeaders = cors;

  switch (path) {
    case '/api/status':
      if (request.method === 'GET') {
        return getStatus(env, request, responseHeaders);
      }
      if (request.method === 'POST') {
        const authError = requireApiKey(env, request);
        if (authError) {
            return authError;
        }
        return setStatus(env, request, responseHeaders);
      }
      break;

    case '/api/status.svg':
      if (request.method === 'GET') {
        return getStatusSvg(env, request, responseHeaders);
      }
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