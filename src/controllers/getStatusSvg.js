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

import { makeBadge } from 'badge-maker';
import { Status } from '../models/status.js';
import { StatusDotColors, StatusLabelColors, StatusLabelTexts } from '../models/status.js';
import { DEFAULT_SVG_BACKGROUND_COLOR, DEFAULT_SVG_STYLE } from '../models/status.js';
import { generateSvgDot } from '../utils/dot.js';
import { validateStatusSvgQuery } from '../utils/validators.js';

function renderEmpty() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"></svg>`;
}

function resolveGlobalStatus(devices) {
  let globalStatus = Status.OFFLINE;

  for (const device of devices) {
    const status = device?.s;

    if (status === Status.ONLINE) {
      return Status.ONLINE;
    }
    
    if (status === Status.BUSY) {
      globalStatus = Status.BUSY;
    }
    else if (status === Status.AWAY && globalStatus !== Status.BUSY) {
      globalStatus = Status.AWAY;
    }
  }

  return globalStatus;
}

export async function getStatusSvg(env, request, responseHeaders) {
  let svg;

  try {
    const url = new URL(request.url);
    const query = url.searchParams;

    const { valid, error, options = {} } = validateStatusSvgQuery(query);

    if (!valid) {
      responseHeaders.set("Content-Type", "application/json");

      return new Response(JSON.stringify({ error }), {
        status: 400,
        headers: responseHeaders
      });
    }

    const list = await env.STATUSDOT_KV.list({ prefix: "status:" });

    const devices = [];

    for (const key of list.keys) {
      const keyContent = await env.STATUSDOT_KV.get(key.name);
      if (!keyContent) {
        continue;
      }

      devices.push(JSON.parse(keyContent));
    }

    const result = devices.length === 0
      ? Status.OFFLINE
      : resolveGlobalStatus(devices);

    const dotColor = StatusDotColors[result];
    const style = options.style ?? DEFAULT_SVG_STYLE;

    let labelColor;
    let labelText;
    let svgDot;
    if (style === "for-the-badge") {
      labelColor = StatusLabelColors[result];
      labelText = StatusLabelTexts[result].toUpperCase();
      svgDot = generateSvgDot(dotColor, 5)
    }
    else {
      labelColor = StatusLabelColors[result];
      labelText = StatusLabelTexts[result];
      svgDot = generateSvgDot(dotColor)
    }

    svg = makeBadge({
      message: labelText,
      color: labelColor,
      labelColor: DEFAULT_SVG_BACKGROUND_COLOR,
      style: style,
      logoBase64: svgDot,
    })

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