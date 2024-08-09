// backend/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Default olarak 'user', admin kullanıcılar için 'admin'
});

module.exports = mongoose.model('User', UserSchema);
