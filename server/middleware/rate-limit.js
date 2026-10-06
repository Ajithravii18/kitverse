import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Reduced from 1000 to 100 for login
  message: { error: 'Too many login attempts. Try again later.' }
});

export const verifyLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { error: 'Too many verification attempts' } });
export const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit to 5 OTP requests per IP
  message: { error: 'Too many OTP requests from this IP. Please try again after 15 minutes.' }
});
