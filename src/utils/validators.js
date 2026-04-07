export function validateValuePayload(payload) {
  if (!payload || typeof payload.value !== 'string') {
    return { valid: false, error: 'Payload must be JSON with a string "value" property' };
  }
  return { valid: true };
}