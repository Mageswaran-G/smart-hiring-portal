// config/index.js
// All environment variables in ONE place
// Never use process.env directly in other files

module.exports = {
  port:        process.env.PORT          || 8000,
  mongoUri:    process.env.MONGO_URI,
  jwtSecret:   process.env.JWT_SECRET,
  jwtRefresh:  process.env.JWT_REFRESH_SECRET,
  bcryptSalt:  parseInt(process.env.BCRYPT_SALT) || 10,
  clientUrl:   process.env.CLIENT_URL    || 'http://localhost:5173',
  baseUrl:     process.env.BASE_URL      || 'http://localhost:8000',
  nodeEnv:     process.env.NODE_ENV      || 'development',
  isProduction: process.env.NODE_ENV === 'production'
};