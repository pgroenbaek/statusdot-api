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

import { getDeviceStatus } from '../controllers/getDeviceStatus.js';
import { getStatus } from '../controllers/getStatus.js';
import { getStatusSvg } from '../controllers/getStatusSvg.js';
import { setDeviceStatus } from '../controllers/setDeviceStatus.js';
import { requireApiKey } from '../middlewares/auth.js';
import { handleCors } from '../middlewares/cors.js';

export async function handleRequest(request, env) {
  const url = new URL(request.url);
  const path = url.pathname;

  const cors = handleCors(env, request);

  if (cors instanceof Response) {
    return cors;
  }

  const responseHeaders = cors;

  // /api/status/:device
  if (path.startsWith('/api/status/')) {
    const device = path.slice('/api/status/'.length);

    if (request.method === 'GET') {
      const authError = requireApiKey(env, request);
      if (authError) {
        return authError;
      }
      
      return getDeviceStatus(env, request, responseHeaders, device);
    }

    if (request.method === 'POST') {
      const authError = requireApiKey(env, request);
      if (authError) {
        return authError;
      }

      return setDeviceStatus(env, request, responseHeaders, device);
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // /api/status
  if (path === '/api/status') {
    if (request.method === 'GET') {
      return getStatus(env, request, responseHeaders);
    }
  }

  // /api/status.svg
  if (path === '/api/status.svg') {
    if (request.method === 'GET') {
      return getStatusSvg(env, request, responseHeaders);
    }
  }

  return new Response(JSON.stringify({ error: "Not Found" }), {
    status: 404,
    headers: { "Content-Type": "application/json" },
  });
}