const {StatusCodes} = require('http-status-codes');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const {BadRequestError, NotFoundError, UnauthenticatedError} = require("../errors");

const register = async (req, res) => {
    const user = await User.create({...req.body});
    const token = user.genAuthToken();
    return res.status(StatusCodes.CREATED).json({token});
}


const login = async (req, res) => {
    const {email, password} = req.body;
    // 1) Check email and password
    if (!email || !password){
        throw new BadRequestError('Please provide email and password.')
    }
    // 2) Find user in DB and compare password
    const user = await User.findOne({email});
    if (!user){
        throw new UnauthenticatedError('User is not providing valid credentials.');
    }
    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid){
        throw new UnauthenticatedError('User is not providing valid credentials.');
    }
    const token = user.genAuthToken();
    return res.status(StatusCodes.OK).json({user: {id: user._id, name: user.name}, token});
}

module.exports = {register, login};