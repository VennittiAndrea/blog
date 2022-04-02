const bcrypt = require('bcrypt');
const User = require('../models/user');

async function authenticate(email, password) { //eslint-disable-line
    const userRecord = await User.findOne({ email });
    if (userRecord) {
      const matched = await bcrypt.compare(password, userRecord.encryptedPassword);
      if (matched) {
        return userRecord;
      }
    }
    return false;
  }

module.exports = authenticate;