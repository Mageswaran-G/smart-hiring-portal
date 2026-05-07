const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT) || 10;

const userSchema = new mongoose.Schema({

  // ── Auth fields ──
  name: {
    type: String, required: true, trim: true
  },
  email: {
    type: String, required: true, unique: true,
    lowercase: true, trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  password: {
    type: String, required: true, minlength: 8
  },
  role: {
    type: String, enum: ['candidate', 'company', 'admin'], default: 'candidate'
  },
  refreshToken: { type: String, default: null },

  // ── Photo ──
  profilePhoto:    { type: String, default: '' },
  photoVisibility: { type: String, enum: ['public', 'private'], default: 'public' },

  // ── Common fields — all roles ──
  bio:      { type: String, default: '', trim: true, maxlength: 1000 },
  phone:    { type: String, default: '', trim: true },
  city:     { type: String, default: '', trim: true },
  state:    { type: String, default: '', trim: true },
  country:  { type: String, default: 'India', trim: true },
  gender:   { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say', ''], default: '' },
  dateOfBirth: { type: String, default: '' },

  // Social links
  linkedIn:  { type: String, default: '', trim: true },
  github:    { type: String, default: '', trim: true },
  portfolio: { type: String, default: '', trim: true },

  // ── Candidate only fields ──
  skills: { type: [String], default: [] },

  // Education — array of entries
  educationList: [{
    degree:      { type: String, default: '' },
    field:       { type: String, default: '' },
    institution: { type: String, default: '' },
    startYear:   { type: String, default: '' },
    endYear:     { type: String, default: '' },
    grade:       { type: String, default: '' },
    current:     { type: Boolean, default: false }
  }],

  // Work history — array of entries
  workHistory: [{
    company:     { type: String, default: '' },
    role:        { type: String, default: '' },
    type:        { type: String, enum: ['full-time', 'part-time', 'internship', 'freelance', ''], default: '' },
    startDate:   { type: String, default: '' },
    endDate:     { type: String, default: '' },
    current:     { type: Boolean, default: false },
    description: { type: String, default: '' }
  }],

  // Career preferences
  jobType:            { type: String, enum: ['full-time', 'part-time', 'internship', 'any', ''], default: '' },
  locationType:       { type: String, enum: ['remote', 'hybrid', 'onsite', 'any', ''], default: '' },
  expectedSalary:     { type: String, default: '' },
  noticePeriod:       { type: String, default: '' },
  preferredLocations: { type: [String], default: [] },

  // Resume
  resume: {
    url:          { type: String, default: '' },
    originalName: { type: String, default: '' },
    size:         { type: Number, default: 0 },
    mimeType:     { type: String, default: '' },
    uploadedAt:   { type: Date }
  },

  // ── Company only fields ──
  companyName:        { type: String, default: '', trim: true },
  companyWebsite:     { type: String, default: '', trim: true },
  industry:           { type: String, default: '', trim: true },
  companySize:        { type: String, default: '' },
  companyDescription: { type: String, default: '', maxlength: 1000 },
  foundedYear:        { type: String, default: '' },
  companyCity:        { type: String, default: '' },
  companyState:       { type: String, default: '' },
  companyCountry:     { type: String, default: 'India' },

}, { timestamps: true, versionKey: false });

// Auto hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

// Compare password method
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Remove sensitive fields from all API responses
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);