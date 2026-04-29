const xss = require('xss');

const sanitize = (obj) => {
  const clean = {};
  for (let key in obj) {
    if (typeof obj[key] === 'string') {
      clean[key] = xss(obj[key]);
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      clean[key] = sanitize(obj[key]);
    } else {
      clean[key] = obj[key];
    }
  }
  return clean;
};

exports.xssClean = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body);
  }
  next();
};