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

export const DEFAULT_SVG_BACKGROUND_COLOR = "#555";
export const DEFAULT_SVG_STYLE = "flat";

export const Status = Object.freeze({
  OFFLINE: 0,
  ONLINE: 1,
  AWAY: 2,
  BUSY: 3,
});

export const StatusDotColors = Object.freeze({
  [Status.OFFLINE]: "#FF6B6B",
  [Status.ONLINE]: "#81E6A2",
  [Status.AWAY]: "#FFE082",
  [Status.BUSY]: "#FF6B6B",
});

export const StatusLabelColors = Object.freeze({
  [Status.OFFLINE]: "#C7474D",
  [Status.ONLINE]: "#32965F",
  [Status.AWAY]: "#B58A22",
  [Status.BUSY]: "#C7474D",
});

export const StatusLabelTexts = Object.freeze({
  [Status.OFFLINE]: "Offline",
  [Status.ONLINE]: "Online",
  [Status.AWAY]: "Away",
  [Status.BUSY]: "Busy",
});