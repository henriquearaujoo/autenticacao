const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Userchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [String],
        enum: ['restrito', 'admin']
    }

})

Userchema.pre('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt((err, salt) => {
        if (!err) {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            })
        }
    })
})

Userchema.methods.checkPassword = function(password) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, this.password, (err, isMath) => {
            if (err) {
                reject(err);
            } else {
                resolve(isMath);
            }
        })

    })
}

const User = mongoose.model('User', Userchema);
module.exports = User