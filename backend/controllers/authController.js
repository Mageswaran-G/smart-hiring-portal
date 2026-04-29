const authService = require('../services/authService');
const ApiResponse = require('../utils/ApiResponse');
const AppError = require('../utils/AppError');

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

exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json(
      new ApiResponse(true, 'Login successful', {
        accessToken: data.accessToken,
        tokenType: data.tokenType,
        expiresIn: data.expiresIn,
        user: data.user
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return next(new AppError('Refresh token required', 400));
    }

    const data = await authService.refresh({ refreshToken });

    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json(
      new ApiResponse(true, 'Token refreshed', {
        accessToken: data.accessToken
      })
    );
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const data = await authService.logout(req.user.id);

    res.clearCookie('refreshToken');

    res.status(200).json(
      new ApiResponse(true, 'Logged out successfully', data)
    );
  } catch (err) {
    next(err);
  }
};