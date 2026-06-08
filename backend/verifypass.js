const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const user = await User.findOne({ email: 'candidate@test.com' }).select('+password');
  const match = await bcrypt.compare('Test1234', user.password);
  console.log('Password match:', match);
  process.exit(0);
}).catch(e => { console.log('Error:', e.message); process.exit(1); });
