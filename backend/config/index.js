// index
// All environment variables in ONE place
// Never use process.env directly in other files

module.exports = {
  port:        process.env.PORT               || 8000,
  mongoUri:    process.env.MONGO_URI,
  jwtSecret:   process.env.JWT_SECRET,
  jwtRefresh:  process.env.JWT_REFRESH_SECRET,
  bcryptSalt:  parseInt(process.env.BCRYPT_SALT) || 10,
  clientUrl:   process.env.CLIENT_URL         || 'http://localhost:5173',
  baseUrl:     process.env.BASE_URL           || 'http://localhost:8000',
  nodeEnv:     process.env.NODE_ENV           || 'development',
  isProduction: process.env.NODE_ENV          === 'production',

  // Email — Gmail SMTP settings
  // EMAIL_USER = your Gmail address
  // EMAIL_PASS = Gmail App Password (NOT your real password)
  // EMAIL_FROM = display name shown in the inbox
  email: {
    user:    process.env.EMAIL_USER || '',
    pass:    process.env.EMAIL_PASS || '',
    from:    process.env.EMAIL_FROM || 'HirePortal <noreply@hireportal.com>',
    enabled: !!(process.env.EMAIL_USER && process.env.EMAIL_PASS),
  },
};