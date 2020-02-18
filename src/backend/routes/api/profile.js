const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');

// @route    GET api/profile/me
// @desc     Get current users profile
// @access   Private
router.get('/me', auth,
    async (req, res) => {
        try {
            const profile = await Profile.findOne({ user: req.user.id }).populate(
                'users',
                ['name', 'avatar']
            );

            if (!profile) {
                return res.status(400).json({ msg: 'There is no profile for this user' });
            }

            res.json(profile);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    PUT api/profile/address
// @desc     Add profile address
// @access   Private
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
            return res.status(400).json({ errors: errors.array() });
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

            // await profile.save();

            res.json(profile);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/profile
// @desc     Delete profile, user & posts
// @access   Private
router.delete('/', auth,
    async (req, res) => {
        try {
            // Remove profile
            await Profile.findOneAndRemove({ user: req.user.id });
            // Remove user
            // await User.findOneAndRemove({ _id: req.user.id });

            res.json({ msg: 'User profile deleted' });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;