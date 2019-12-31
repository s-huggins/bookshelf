const mongoose = require('mongoose');
const Profile = require('./Profile');

const { Schema } = mongoose;

const avatarSchema = new Schema({
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  filename: String,
  md5: String,
  contentType: String,
  metadata: {
    user_id: Schema.Types.ObjectId,
    profile_id: Schema.Types.ObjectId
  }
});

const Avatar = mongoose.model('Avatar', avatarSchema, 'avatars.files');

module.exports = Avatar;
