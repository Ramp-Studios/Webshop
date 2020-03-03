const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/frontend/img/');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().getMilliseconds() + "_" + file.originalname)
    }
});

const upload = multer({ storage: storage });

// Models
const Product = require('../../models/Product');
const User = require('../../models/User');

// @route    GET api/products
// @desc     Get all products
// @access   Public
router.get('/',
    async (req, res) => {
        try {
            let pageNo = parseInt(req.query.pageNo) || 1;
            let limit = parseInt(req.query.limit) || 10;
            let sortBy = req.query.sortBy;
            let allowedSort = [
                "dateUp",
                "dateDown",
                "nameUp",
                "nameDown",
                "priceUp",
                "priceDown",
            ];
            let search = req.query.search;
            let category = req.query.category;
            let filter = {};
            if (search) {
                filter.name = new RegExp("^" + search, "i");
            }
            if (category) {
                filter.category = new RegExp("^" + category, "i");
            }
            let sort = {};
            if (allowedSort.indexOf(sortBy) !== -1) {
                if (sortBy.indexOf("Up") !== -1) {
                    let variable = sortBy.slice(0, sortBy.indexOf("Up"));
                    sort[variable] = -1;
                } else {
                    let variable = sortBy.slice(0, sortBy.indexOf("Down"));
                    sort[variable] = 1;
                }
            }
            const count = await Product.countDocuments();
            let totalPages = Math.ceil(count / limit);
            const products = await Product.find(filter).sort(sort).skip(limit * (pageNo - 1)).limit(limit);
            res.json({ products: products, totalPages: totalPages, limit: limit, pageNo: pageNo, totalProducts: count });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/products/:id
// @desc     Get product by ID
// @access   Public
router.get('/:id',
    async (req, res) => {
        try {
            // Check for ObjectId format
            let product;
            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                product = await Product.findById(req.params.id);

                if (product) {
                    return res.json(product);
                }
            }
            return res.status(404).json({ msg: 'product not found' });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

//post Product toevoegen          admin
// @route    POST api/products
// @desc     Create a post only Array 
// @access   Private
router.post('/', [auth, upload.array('images', 5), [
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('price', 'price is required').not().isEmpty(),
],
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            if (user.role !== 'admin') {
                res.status(403).send('Not authorized');
                return;
            }

            const { name, brand, category, description, price, sale, quantityInStock } = req.body;
            images = [];
            for (let i = 0; i < req.files.length; i++) {
                images.push(req.files[i].path.replace('src/frontend/', ''));
            }

            const newProduct = new Product({ name, brand, images, category, description, price, sale, quantityInStock });

            const product = await newProduct.save();
            res.json(product);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    PUT api/products/:id/restock
// @desc     Restock a product
// @access   Private
router.put('/:id/restock', [
    auth, [
        check('quantity', 'Quantity must not be empty').notEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (user.role !== 'admin') {
                res.status(403).send('Not authorized');
                return;
            }
            const product = await Product.findById(req.params.id);
            const quantity = parseInt(req.body.quantity);
            product.quantityInStock = parseInt(product.quantityInStock) + quantity;
            await product.save();
            res.json({ msg: "Restock product" });
            return;
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    PUT api/products/:id/review
// @desc     Review a product
// @access   Private
router.put('/:id/review', [
    auth, [
        check('text', 'You must write a message').not().isEmpty(),
        check('rating', 'Rating must be between 1 - 5').matches(/^[1-5]$/)
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(400).json("Could not find product");
            const user = await User.findById(req.user.id);

            const review = {
                user: req.user.id,
                text: req.body.text,
                rating: req.body.rating,
                name: user.name,
                avatar: user.avatar
            };

            product.reviews.unshift(review);
            await product.save();
            res.json(product);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    DELETE api/products/:id
// @desc     Delete a product
// @access   Private
router.delete('/:id', auth,
    async (req, res) => {
        try {
            // Check for ObjectId format
            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                const user = await User.findById(req.user.id).select('-password');
                if (user.role !== 'admin') {
                    res.status(403).send('Not authorized');
                    return;
                }
                const product = await Product.findById(req.params.id);
                if (product) {
                    await product.remove();
                    res.json({ msg: 'Product removed' });
                }
            }
            return res.status(404).json({ msg: 'product not found' });
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;