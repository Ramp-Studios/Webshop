const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const {serverErrorResponse, successResponse, errorResponse, validationErrorResponse} = require('../../util/responses');

/**
 * @api {post} api/users Create user
 * @apiName CreateUser
 * @apiGroup Users
 * @apiPermission none
 * 
 * @apiParam {String} name              Mandatory Name.
 * @apiParam {String} email             Mandatory E-mail.
 * @apiParam {String{6..}} password     Mandatory password with at least 6 characters.
 * @apiParam {String} [role=guest]      Optional role, if not send will fall to guest.
 * @apiParamExample {json} Request-Example:
 *      {
 *      	"name": "admin",
 *      	"email": "admin@gmail.com",
 *      	"password": "testtest",
 *          "role": "admin"
 *      }
 * 
 * @apiUse UserCreateSuccess
 * @apiUse UserExistsError
 * @apiUse ValidationError
 * @apiUse ServerError
 */
router.post('/', [
    check('name', 'Name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email')
        .isEmail(),
    check(
        'password',
        'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(validationErrorResponse(errors.array(), 400));
        }

        let { name, email, password, role } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json(errorResponse('User already exists.', 400));
            }

            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            role = role === 'admin' ? role : 'guest';
            user = new User({
                name,
                email,
                avatar,
                password,
                role
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();

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
                    res.json(successResponse({token}));
                }
            );
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

module.exports = router;


