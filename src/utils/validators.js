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
import { DEFAULT_SVG_STYLE } from '../models/status.js';

const VALID_STYLES = ["flat", "flat-square", "plastic", "for-the-badge"];

export function validateStatusSvgQuery(query) {
  const options = {};

  const style = query.get("style") ?? DEFAULT_SVG_STYLE;
  if (style !== null && !VALID_STYLES.includes(style)) {
    return { valid: false, error: `The query parameter "style" must be one of: ${VALID_STYLES.join(", ")}` };
  }
  options.style = style;

  return { valid: true, options };
}

export function validateStatusPayload(payload) {
  if (!payload) {
    return { valid: false, error: 'Payload must be JSON' };
  }

  if (typeof payload.status !== 'number') {
    return { valid: false, error: 'The "status" property must be a number' };
  }

  const validStatuses = Object.values(Status);
  if (!validStatuses.includes(payload.status)) {
    return { valid: false, error: `Invalid status value. Must be one of: ${validStatuses.join(", ")}` };
  }

  if ('expirationTtl' in payload) {
    if (typeof payload.expirationTtl !== 'number') {
      return { valid: false, error: 'The "expirationTtl" property must be a number if provided' };
    }
    if (payload.expirationTtl < 60) {
      return { valid: false, error: 'The "expirationTtl" property must be greater than 59 seconds if provided' };
    }
  }

  return { valid: true };
}
