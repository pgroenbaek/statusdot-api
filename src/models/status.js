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

export const DEFAULT_STATUS_EXPIRATION_SECONDS = 7 * 60;

export const Status = Object.freeze({
  OFFLINE: 0,
  ONLINE: 1,
  AWAY: 2,
  BUSY: 3,
});

export const StatusColors = Object.freeze({
  [Status.OFFLINE]: "#FF0000",
  [Status.ONLINE]: "#00FF00",
  [Status.AWAY]: "#FFA500",
  [Status.BUSY]: "#FF0000",
});

export const StatusLabels = Object.freeze({
  [Status.OFFLINE]: "OFFLINE",
  [Status.ONLINE]: "ONLINE",
  [Status.AWAY]: "AWAY",
  [Status.BUSY]: "BUSY",
});