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

import { STATUS_EXPIRATION_SECONDS } from '../models/status.js';
import { validateStatusPayload } from '../utils/validators.js';
import { handleCors } from '../middlewares/cors.js';

export async function setStatus(env, request) {
  const cors = handleCors(request);

  if (cors instanceof Response) {
    return cors;
  }

  const headers = cors;

  try {
    const payload = await request.json();

    const { valid, error } = validateStatusPayload(payload);
    if (!valid) {
      headers.set("Content-Type", "application/json");

      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: headers
      });
    }

    await env.STATUSDOT_KV.put("status", payload.status, {
      expirationTtl: STATUS_EXPIRATION_SECONDS
    });

    headers.set("Content-Type", "application/json");

    return new Response(JSON.stringify({ success: true, status: payload.status }), {
      status: 200,
      headers: headers,
    });
  } catch (err) {
    headers.set("Content-Type", "application/json");

    return new Response(JSON.stringify({ error: 'Invalid JSON or server error' }), {
      status: 400,
      headers: headers,
    });
  }
}