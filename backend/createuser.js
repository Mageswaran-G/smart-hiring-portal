const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const hash = await bcrypt.hash('Test1234', 10);
  const user = await User.create({
    name: 'Test Candidate',
    email: 'candidate@test.com',
    password: hash,
    role: 'candidate'
  });
  console.log('Created:', user.email, user.role);
  process.exit(0);
}).catch(e => { console.log('Error:', e.message); process.exit(1); });
