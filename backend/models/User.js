const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT) || 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email']
  },
  password: {
  type: String,
  required: true,
  minlength: 8
},
  role: {
    type: String,
    enum: ['candidate', 'company', 'admin'],
    default: 'candidate'
  },
  refreshToken: {
  type: String,
  default: null
},
// ── Profile Fields ──

// For both candidate and company
bio: {
  type: String,
  default: '',
  trim: true,
  maxlength: 500,   // max 500 characters
},

location: {
  type: String,
  default: '',
  trim: true,
},

phone: {
  type: String,
  default: '',
  trim: true,
},

profilePhoto: {
  type: String,
  default: '',   // will store file path later
},

// ── Candidate only fields ──
skills: {
  type: [String],  // array of strings ['React', 'Node.js']
  default: [],
},

education: {
  type: String,
  default: '',
  trim: true,
},

experience: {
  type: String,
  default: '',
  trim: true,
},

resume: {
  url:          { type: String, default: '' },
  originalName: { type: String, default: '' },
  size:         { type: Number, default: 0  },
  mimeType:     { type: String, default: '' },
  uploadedAt:   { type: Date                }
},

// ── Company only fields ──
companyName: {
  type: String,
  default: '',
  trim: true,
},

companyWebsite: {
  type: String,
  default: '',
  trim: true,
},

industry: {
  type: String,
  default: '',
  trim: true,
},
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

// Remove password from all responses automatically
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};


module.exports = mongoose.model('User', userSchema);