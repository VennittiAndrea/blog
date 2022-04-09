const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  nameAsEditor: {
    type: String,
  },
  email: {
    type: String,
    required: true
  },
  encryptedPassword: {
    type: String,
    required: true
  },
  articles: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Article'
    }
  ], 
  role: {
    type: String,
    enum: ['basic', 'creator', 'admin'],
    required: true
   }
});

module.exports = mongoose.model('User', userSchema);
