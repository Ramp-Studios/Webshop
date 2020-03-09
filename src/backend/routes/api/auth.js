const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const {serverErrorResponse, successResponse, errorResponse, validationErrorResponse} = require('../../util/responses');

const User = require('../../models/User');

/**
 * @api {get} api/auth Get user
 * @apiName GetUser
 * @apiGroup Auth
 * @apiPermission User
 * 
 * @apiSuccess {Boolean}  success       if the request was a success
 * @apiSuccess {String}   role          The role of the user
 * @apiSuccess {String}   _id           The id of the user
 * @apiSuccess {String}   name          The name of the user 
 * @apiSuccess {String}   email         The e-mail address of the user
 * @apiSuccess {String}   avatar        The avatar if the user based on gravatar. See https://www.gravator.com/
 * @apiSuccess {Date}     date          The date of registration of the user
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "role": "admin",
 *       "_id": "5e4e6d499052c800430130b8",
 *       "name": "admin",
 *       "email": "admin@gmail.com",
 *       "avatar": "//www.gravatar.com/avatar/75d23af433e0cea4c0e45a56dba18b30?s=200&r=pg&d=mm",
 *       "date": "2020-02-20T11:28:09.328Z",
 *       "__v": 0
 *     }
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(successResponse(user));
    } catch (err) {
        console.error(err.message);
        res.status(500).json(serverErrorResponse);
    }
});

/**
 * @api {post} api/auth Login user
 * @apiName LoginUser
 * @apiGroup Auth
 * @apiPermission none
 * 
 * @apiParam {String} email             Mandatory E-mail.
 * @apiParam {String} password          Mandatory password with at least 6 characters.
 * @apiParamExample {json} Request-Example:
 *      {
 *      	"email": "admin@gmail.com",
 *      	"password": "testtest"
 *      }
 * 
 * @apiSuccess {Boolean}  success       if the request was a success
 * @apiSuccess {String}   token         A token that can be used in the x-auth-token header for authentication.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "token": "<token>"
 *     }
 * 
 * @apiUse InvalidCredentialsError
 * @apiUse ValidationError
 * @apiUse ServerError
 */
router.post('/', [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(validationErrorResponse(errors.array(), 400));
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json(errorResponse('Invalid Credentials.', 400));
            }
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json(errorResponse('Invalid Credentials.', 400));
            }

            const payload = {
                user: {
                    id: user.id
                }
            };

            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                    if (err) throw err;
                    res.json(successResponse({ token }));
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

module.exports = router;