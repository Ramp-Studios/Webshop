const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const {messageResponse, successResponse, serverErrorResponse, validationErrorResponse} = require('../../util/responses');

/**
 * @api {get} api/profile/me Get current user profile
 * @apiName GetMyProfile
 * @apiGroup Profile
 * @apiPermission User
 * 
 * @apiUse ProfileSuccess
 * @apiUse NoProfileFoundError
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.get('/me', auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id }).populate(
                'users',
                ['name', 'avatar']
            );

            if (!profile) {
                return res.status(400).json(messageResponse('There is no profile for this user.', false));
            }
            res.json(successResponse(profile));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {put} api/profile/address Add/Update address
 * @apiName UpdateAddress
 * @apiGroup Profile
 * @apiPermission User
 * 
 * @apiParam {String} street       Mandatory Street.
 * @apiParam {Number} houseNumber  Mandatory House number .
 * @apiParam {String} zipcode      Mandatory zipcode.
 * @apiParam {String} city         Mandatory city.
 * @apiParamExample {json} Request-Example: 
 *      {
 *          "street": "Tinwerf",
 *          "houseNumber": 16,
 *          "zipcode": "2544ED",
 *          "city": "Den Haag",
 *      }
 * 
 * @apiUse ProfileSuccess
 * @apiUse ValidationError
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.put('/address', [
        auth,
        [
            check('street', 'Street is required')
                .not()
                .isEmpty(),
            check('houseNumber', 'Housenumber is required')
                .not()
                .isEmpty(),
            check('zipcode', 'Zipcode is required')
                .not()
                .isEmpty(),
            check('city', 'city is required')
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(validationErrorResponse(errors.array(), 400));
        }

        // Get the values from the req.body
        const {
            street, houseNumber, zipcode, city
        } = req.body;

        const address = {
            street, houseNumber, zipcode, city
        };

        try {
            let profileFields = {
                user: req.user.id,
                address: address
            }
            let profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true, upsert: true });

            res.json(successResponse(profile));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {delete} api/profile Delete profile
 * @apiName DeleteProfile
 * @apiGroup Profile
 * @apiPermission User
 * 
 * @apiSuccess {Boolean}  success               if the request was a success
 * @apiSuccess {String}   msg                   The message of delete
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "msg": "User profile deleted."
 *     }
 * 
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.delete('/', auth,
    async (req, res) => {
        try {
            // Remove profile
            await Profile.findOneAndRemove({ user: req.user.id });
            // Remove user
            // await User.findOneAndRemove({ _id: req.user.id });

            res.json(messageResponse('User profile deleted.', true));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

module.exports = router;