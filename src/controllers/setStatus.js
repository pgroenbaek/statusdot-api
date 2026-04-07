
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