export async function getStatus(env) {
  try {
    const value = await env.MY_KV.get("status");
    return new Response(JSON.stringify({ value: value || null }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to get value' }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}