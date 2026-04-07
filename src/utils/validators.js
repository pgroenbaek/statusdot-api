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

export function validateStatusPayload(payload) {
  if (!payload || typeof payload.status !== 'number') {
    return { valid: false, error: 'Payload must be JSON with a numeric "status" property' };
  }

  const validValues = Object.values(Status);
  if (!validValues.includes(payload.status)) {
    return { valid: false, error: `Invalid status value. Must be one of: ${validValues.join(", ")}` };
  }

  return { valid: true };
}