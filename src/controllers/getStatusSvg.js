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

import { OnlineStatusSvg } from 'online-status-svg';
import { Status } from '../models/status.js';
import { StatusColors, StatusLabels } from '../models/status.js';
import { validateStatusSvgQuery } from '../utils/validators.js';

function renderEmpty() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"></svg>`;
}

export async function getStatusSvg(env, request, responseHeaders) {
  let svg;
  try {

    const url = new URL(request.url);

    const { valid, error, options = {} } = validateStatusSvgQuery(url.searchParams);

    if (!valid) {
      responseHeaders.set("Content-Type", "application/json");

      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: responseHeaders
      });
    }

    const status = await env.STATUSDOT_KV.get("status");

    const result = status === null ? Status.OFFLINE : Number(status);

    const label = StatusLabels[result]
    const color = StatusColors[result]

    const statusSvg = new OnlineStatusSvg({
      statusText: label,
      dotColor: color,
      ...options
    });

    svg = statusSvg.render();
  } catch {
    svg = renderEmpty();
  }

  responseHeaders.set("Content-Type", "image/svg+xml");
  responseHeaders.set(
    "Cache-Control",
    "public, max-age=300, s-maxage=300, stale-while-revalidate=60"
  );

  return new Response(svg, {
    status: 200,
    headers: responseHeaders,
  });
}
