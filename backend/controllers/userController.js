// userController.js
// Purpose: Handle HTTP requests for user routes
// Thin layer — only handles req/res
// All business logic is in userService.js

const userService = require('../services/userService');
const ApiResponse = require('../utils/ApiResponse');

// GET ALL USERS
// Route: GET /api/v1/users
// Access: Public (for now — will be admin only later)
exports.getUsers = async (req, res, next) => {
  try {
    // Call service layer to get users from database
    const users = await userService.getUsers();

    // Send standard API response format
    res.status(200).json(
      new ApiResponse(true, 'Users fetched successfully', users)
    );
  } catch (err) {
    // Pass error to centralized error handler
    next(err);
  }
};

// GET USER PROFILE
// Route: GET /api/v1/users/profile
// Access: Protected (needs JWT token)
exports.getProfile = async (req, res, next) => {
  try {
    // req.user is set by verifyToken middleware
    // Contains { id, role, email } from JWT
    const user = await userService.getUserById(req.user.id);

    res.status(200).json(
      new ApiResponse(true, 'Profile fetched successfully', user)
    );
  } catch (err) {
    next(err);
  }
};