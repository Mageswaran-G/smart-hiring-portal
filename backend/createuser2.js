const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  
  // Delete old broken user first
  await User.deleteOne({ email: 'candidate@test.com' });
  
  // Create with plain password — model pre-save hook will hash it
  const user = new User({
    name: 'Test Candidate',
    email: 'candidate@test.com',
    password: 'Test1234',
    role: 'candidate'
  });
  await user.save();
  console.log('Created:', user.email, user.role);
  process.exit(0);
}).catch(e => { console.log('Error:', e.message); process.exit(1); });
