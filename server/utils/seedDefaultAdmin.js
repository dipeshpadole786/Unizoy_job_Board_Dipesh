const User = require('../models/User');

const DEFAULT_ADMIN = {
  name: 'Dipesh',
  email: 'dipeshpadole3@gmail.com',
  role: 'admin',
};

const seedDefaultAdmin = async () => {
  const existing = await User.findOne({ email: DEFAULT_ADMIN.email });

  if (!existing) {
    await User.create(DEFAULT_ADMIN);
    console.log(`[seed] Default admin created: ${DEFAULT_ADMIN.email}`);
    return;
  }

  const needsUpdate =
    existing.role !== 'admin' ||
    existing.name !== DEFAULT_ADMIN.name;

  if (needsUpdate) {
    existing.role = 'admin';
    existing.name = DEFAULT_ADMIN.name;
    await existing.save();
    console.log(`[seed] Default admin updated: ${DEFAULT_ADMIN.email}`);
  }
};

module.exports = seedDefaultAdmin;

