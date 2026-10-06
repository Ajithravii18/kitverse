import { createHmac, timingSafeEqual } from 'node:crypto';

export function isValidRazorpaySignature(orderId, paymentId, signature, secret) {
  if (![orderId, paymentId, secret].every(value => typeof value === 'string' && value.length > 0) ||
      typeof signature !== 'string' || !/^[a-f\d]{64}$/i.test(signature)) return false;
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest();
  const supplied = Buffer.from(signature, 'hex');
  return supplied.length === expected.length && timingSafeEqual(expected, supplied);
}
