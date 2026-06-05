const mongoose = require('mongoose');
const AppError  = require('../utils/AppError');

const validateObjectId = (...params) => (req, res, next) => {
  for (const param of params) {
    if (!mongoose.Types.ObjectId.isValid(req.params[param])) {
      return next(new AppError(`Invalid ID: ${param}`, 400));
    }
  }
  next();
};

module.exports = validateObjectId;
