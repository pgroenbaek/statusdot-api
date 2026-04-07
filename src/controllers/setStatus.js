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

import { validateValuePayload } from '../utils/validators.js';

export async function setStatus(env, request) {
  try {
    const payload = await request.json();
    const { valid, error } = validateValuePayload(payload);
    if (!valid) {
      return new Response(JSON.stringify({ error }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const formattedValue = _.toUpper(payload.value);
    await env.MY_KV.put("status", formattedValue);

    return new Response(JSON.stringify({ success: true, value: formattedValue }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON or server error' }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}