const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const user = await User.findOne({ email: 'candidate@test.com' }).select('+password');
  console.log('Found:', !!user);
  console.log('Hash:', user?.password?.substring(0, 20));
  console.log('isSuspended:', user?.isSuspended);
  console.log('isDeleted:', user?.isDeleted);
  process.exit(0);
}).catch(e => { console.log('Error:', e.message); process.exit(1); });
