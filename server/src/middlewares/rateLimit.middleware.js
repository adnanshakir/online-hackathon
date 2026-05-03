import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

// ─── Auth routes — strict (prevent brute force) ───
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 15,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again after 15 minutes.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Reset password — strict (prevent token reuse) ───
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many reset attempts, please try again after 15 minutes.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Global API — basic protection ────────────────
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Increased for real-time polling
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ─── Authenticated API — track by User ID ─────────
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Increased for real-time polling
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests, please slow down.',
    });
  },

  // Only skip health check (NOT all GET requests)
  skip: (req) => req.path === '/health',

  // Use user ID if authenticated, fallback to IP
  keyGenerator: (req) => req.user?._id?.toString() || ipKeyGenerator(req),

  standardHeaders: true,
  legacyHeaders: false,
});
