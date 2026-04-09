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

const FONT_WEIGHTS = ["bold", "normal"];
const BACKGROUND_STYLES = ["none", "rectangular", "circular"];

const NAMED_COLORS = new Set([
  "aliceblue", "antiquewhite", "aqua", "aquamarine", "azure", "beige", "bisque", "black",
  "blanchedalmond", "blue", "blueviolet", "brown", "burlywood", "cadetblue", "chartreuse",
  "chocolate", "coral", "cornflowerblue", "cornsilk", "crimson", "cyan", "darkblue",
  "darkcyan", "darkgoldenrod", "darkgray", "darkgreen", "darkgrey", "darkkhaki",
  "darkmagenta", "darkolivegreen", "darkorange", "darkorchid", "darkred", "darksalmon",
  "darkseagreen", "darkslateblue", "darkslategray", "darkslategrey", "darkturquoise",
  "darkviolet", "deeppink", "deepskyblue", "dimgray", "dimgrey", "dodgerblue",
  "firebrick", "floralwhite", "forestgreen", "fuchsia", "gainsboro", "ghostwhite",
  "gold", "goldenrod", "gray", "green", "greenyellow", "grey", "honeydew", "hotpink",
  "indianred", "indigo", "ivory", "khaki", "lavender", "lavenderblush", "lawngreen",
  "lemonchiffon", "lightblue", "lightcoral", "lightcyan", "lightgoldenrodyellow",
  "lightgray", "lightgreen", "lightgrey", "lightpink", "lightsalmon", "lightseagreen",
  "lightskyblue", "lightslategray", "lightslategrey", "lightsteelblue", "lightyellow",
  "lime", "limegreen", "linen", "magenta", "maroon", "mediumaquamarine", "mediumblue",
  "mediumorchid", "mediumpurple", "mediumseagreen", "mediumslateblue",
  "mediumspringgreen", "mediumturquoise", "mediumvioletred", "midnightblue",
  "mintcream", "mistyrose", "moccasin", "navajowhite", "navy", "oldlace", "olive",
  "olivedrab", "orange", "orangered", "orchid", "palegoldenrod", "palegreen",
  "paleturquoise", "palevioletred", "papayawhip", "peachpuff", "peru", "pink",
  "plum", "powderblue", "purple", "rebeccapurple", "red", "rosybrown", "royalblue",
  "saddlebrown", "salmon", "sandybrown", "seagreen", "seashell", "sienna", "silver",
  "skyblue", "slateblue", "slategray", "slategrey", "snow", "springgreen",
  "steelblue", "tan", "teal", "thistle", "tomato", "turquoise", "violet",
  "wheat", "white", "whitesmoke", "yellow", "yellowgreen"
]);

function isColorString(value) {
  if (NAMED_COLORS.has(value)) {
    return true;
  }
  if (/^#[0-9a-fA-F]{3,8}$/.test(value)) {
    return true;
  }
  if (/^rgb\(.+\)$/.test(value)) {
    return true;
  }
  if (/^rgba\(.+\)$/.test(value)) {
    return true;
  }
  if (/^hsl\(.+\)$/.test(value)) {
    return true;
  }
  if (/^hsla\(.+\)$/.test(value)) {
    return true;
  }

  return false;
}

export function validateStatusSvgQuery(query) {
  const options = {};

  const numberFields = [
    "dotStrokeWidth",
    "textSpacing",
    "backgroundStrokeWidth"
  ];

  const colorFields = [
    "dotStrokeColor",
    "textColor",
    "backgroundColor",
    "backgroundStrokeColor"
  ];

  for (const field of colorFields) {
    const value = query.get(field);
    if (value !== null) {
      if (!isColorString(value)) {
        return { valid: false, error: `The query parameter "${field}" must be a valid CSS color` };
      }
      options[field] = value;
    }
  }

  for (const field of numberFields) {
    const value = query.get(field);
    if (value !== null) {
      const number = Number(value);
      if (Number.isNaN(number)) {
        return { valid: false, error: `The query parameter "${field}" must be a number` };
      }
      options[field] = number;
    }
  }

  const fontWeight = query.get("textFontWeight");
  if (fontWeight !== null) {
    if (!FONT_WEIGHTS.includes(fontWeight)) {
      return { valid: false, error: `The query parameter "textFontWeight" must be "bold" or "normal"` };
    }
    options.textFontWeight = fontWeight;
  }

  const backgroundStyle = query.get("backgroundStyle");
  if (backgroundStyle !== null) {
    if (!BACKGROUND_STYLES.includes(backgroundStyle)) {
      return { valid: false, error: `The query parameter "backgroundStyle" must be one of: ${BACKGROUND_STYLES.join(", ")}` };
    }
    options.backgroundStyle = backgroundStyle;
  }

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
