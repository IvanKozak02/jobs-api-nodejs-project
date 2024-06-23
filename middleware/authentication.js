const UnauthenticatedError = require('../errors/unauthenticated');
const jwt = require('jsonwebtoken');
const isAuthenticated = (req, res, next) => {
    // 1) Check if auth token is provided
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Token was not provided.');
    }
    // 2) Check if token is valid
    const providedToken = authHeader.split(' ')[1];
    try {
        const decode = jwt.verify(providedToken, process.env.JWT_SECRET);
        const {id, name} = decode;
        req.user = {id, name: name};       // attach user to the req object
        next();
    }catch (err){
        throw new UnauthenticatedError('Authentication invalid.')
    }

}

module.exports = {isAuthenticated};