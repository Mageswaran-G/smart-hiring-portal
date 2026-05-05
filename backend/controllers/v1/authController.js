// authController.js
// Thin layer — only handles req/res
// All business logic is in authService.js


const authService = require('../../services/v1/authService');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

// ── Cookie config — same options used for SET and CLEAR ──
// IMPORTANT: Must match exactly when setting and clearing
// Otherwise browser will not clear the cookie properly
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
});

// ── SIGNUP ──
exports.signup = async (req, res, next) => {
  try {
    const data = await authService.signup(req.body);
    res.status(201).json(
      new ApiResponse(true, 'User registered successfully', data)
    );
  } catch (err) {
    next(err);
  }
};

// ── LOGIN ──
exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    res.cookie('refreshToken', data.refreshToken, getCookieOptions());

    res.status(200).json(
      new ApiResponse(true, 'Login successful', {
        accessToken: data.accessToken,
        tokenType: 'Bearer',
        expiresIn: '15m',
        user: data.user
      })
    );
  } catch (err) {
    next(err);
  }
};

// ── REFRESH ──
exports.refresh = async (req, res, next) => {
  try {
    // Safe extraction — no crash if body or cookie is missing
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
      return next(new AppError('Refresh token required', 400));
    }

    const data = await authService.refresh({ refreshToken });

    // Set new rotated refresh token in cookie
    res.cookie('refreshToken', data.refreshToken, getCookieOptions());

    res.status(200).json(
      new ApiResponse(true, 'Token refreshed', {
        accessToken: data.accessToken,
        tokenType: 'Bearer',
        expiresIn: '15m',
        user: data.user
      })
    );
  } catch (err) {
    next(err);
  }
};

// ── LOGOUT ──
exports.logout = async (req, res, next) => {
  try {
    // Defensive check — in case route is called without verifyToken
    if (!req.user?.id) {
      return next(new AppError('Unauthorized', 401));
    }

    await authService.logout(req.user.id);

    // IMPORTANT: clearCookie must use SAME options as cookie was set with
    // Otherwise browser ignores the clear instruction
    res.clearCookie('refreshToken', getCookieOptions());

    res.status(200).json(
      new ApiResponse(true, 'Logged out successfully', null)
    );
  } catch (err) {
    next(err);
  }
};