export function requireApiKey(request, env) {
  const apiKey = request.headers.get("x-api-key");
  const expectedKey = env.API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey !== expectedKey) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return null;
}