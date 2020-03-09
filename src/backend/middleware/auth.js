const jwt = require('jsonwebtoken');
const config = require('config');
const {errorResponse, serverErrorResponse} = require('../util/responses');


module.exports = async (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');
    const tokenInvalidError = errorResponse('No token or invalid token, authorization denied', 401);
    // Check if not token
    if (!token) {
        return res.status(401).json(tokenInvalidError);
    }

    // Verify token
    try {
        await jwt.verify(token, config.get('jwtSecret'), (error, decoded) => {
            if (error) {
                res.status(401).json(tokenInvalidError);
            }
            else {
                req.user = decoded.user;
                next();
            }
        });
    } catch (err) {
        console.error('something wrong with auth middleware')
        res.status(500).json(serverErrorResponse);
    }
};