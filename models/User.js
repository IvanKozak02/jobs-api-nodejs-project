const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minLength: [2, 'Name cannot be less than 2 symbols'],
        maxLength: [20, 'Name cannot be greater than 20 symbols'],
        required: [true, 'Name must be provided']
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: [true, 'Email must be provided'],
        match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password must be provided']
    },
});

UserSchema.pre('save', async function () {       // before save document in DB
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

UserSchema.methods.genAuthToken = function () {
    return jwt.sign(
        {id: this._id, name: this.name},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_LIFETIME}
    );
}

UserSchema.methods.isPasswordValid = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}


const User = mongoose.model('User', UserSchema);


module.exports = User;
