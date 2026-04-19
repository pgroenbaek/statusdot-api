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

import { Status } from '../models/status.js';

export async function getDeviceStatus(env, request, responseHeaders, device) {
  try {
    const key = `status:${device}`;

    const keyContent = await env.STATUSDOT_KV.get(key);

    let result;

    if (keyContent === null) {
      result = {
        status: Status.OFFLINE,
        updated_at: 0
      };
    } else {
      const parsed = JSON.parse(keyContent);

      result = {
        status: parsed.s,
        updated_at: parsed.u
      };
    }

    responseHeaders.set("Content-Type", "application/json");
    responseHeaders.set(
      "Cache-Control",
      "public, max-age=300, s-maxage=300, stale-while-revalidate=60"
    );

    return new Response(JSON.stringify({
      device,
      ...result
    }), {
      status: 200,
      headers: responseHeaders,
    });

  } catch (err) {
    responseHeaders.set("Content-Type", "application/json");

    return new Response(JSON.stringify({
      error: 'Failed to get value'
    }), {
      status: 500,
      headers: responseHeaders,
    });
  }
}