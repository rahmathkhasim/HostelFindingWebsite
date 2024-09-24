const mongoose = require('mongoose');

// User schema
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Export User model
module.exports = mongoose.model('User', UserSchema);
