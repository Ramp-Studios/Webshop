const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const {serverErrorResponse, messageResponse, successResponse, errorResponse, validationErrorResponse} = require('../../util/responses');

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

/**
 * @api {get} api/products Get all the products
 * @apiName GetProducts
 * @apiGroup Products
 * 
 * @apiParam {String="dateUp","dateDown","nameUp","nameDown","priceUp","priceDown"} [sortBy]       Sort by query param
 * @apiParam {Number} [limit]        Limit amount of product you want to receive query param
 * @apiParam {Number} [pageNo]       Page Number query param
 * @apiParam {String} [search]       Search query param to search by name
 * @apiParam {String} [category]     Category query param for selecting only that category
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:5000/api/products?sortBy=nameUp&limit=5&pageNo=1
 * 
 * @apiUse ProductsSuccess 
 * @apiUse ServerError
 */
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
                filter.name = new RegExp(`${search}+`, "i");
            }
            if (category) {
                filter.category = category;
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
            res.json(successResponse({ 
                products: products, 
                totalPages: totalPages, 
                limit: limit, 
                pageNo: pageNo, 
                totalProducts: count 
            }));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {get} api/products/:id Get product by id
 * @apiName GetProductById
 * @apiGroup Products
 * 
 * @apiParam {String} id     The id of the product
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:5000/api/products/5e4e6ede9052c800430130b9
 * 
 * @apiUse ProductSuccess
 * @apiUse NoProductFoundError
 * @apiUse ServerError
 */
router.get('/:id',
    async (req, res) => {
        try {
            // Check for ObjectId format
            let product;
            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                product = await Product.findById(req.params.id);

                if (product) {
                    return res.json(successResponse(product));
                }
            }
            return res.status(404).json(errorResponse('product not found.', 404));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {post} api/products Add product
 * @apiName Add product
 * @apiGroup Products
 * @apiPermission Admin
 * @apiUse AdminPermissionDescrp
 * 
 * @apiParam {String} name                  Name of the product.
 * @apiParam {String} [brand]               Brand of the product
 * @apiParam {String} category              Category of the product
 * @apiParam {String} [description]         The description of the product
 * @apiParam {String} quantityInStock       The quantity of the product in stock
 * @apiParam {String} price                 The price of the product
 * @apiParam {Number=[0.00...1.00]} [sale=1]  The amount of discount
 * @apiParam {Image[]} [images]             The images in a list
 * @apiParamExample {formdata} Request-Example: 
 *      Multipart form
 *      name                 "Nike AirMax"
 *      brand                "Nike"
 *      category             "Shoes"
 *      description          "This is a shoe"
 *      quantityInStock      5
 *      price                58.95
 *      sale                 1
 *      images               ["ImageData - file select"]
 *
 * @apiUse HeaderAuthToken
 * @apiUse ProductSuccess
 * @apiUse NotAuthorizedError
 * @apiUse NoTokenError
 * @apiUse ValidationError
 * @apiUse ServerError
 */
router.post('/', [auth, upload.array('images', 5), [
    check('name', 'Name is required').not().isEmpty(),
    check('category', 'category is required').not().isEmpty(),
    check('price', 'price is required').not().isEmpty(),
    check('quantityInStock', 'quantityInStock is required').not().isEmpty(),
],
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(validationErrorResponse(errors.array(), 400));
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            if (user.role !== 'admin') {
                res.status(403).json(errorResponse('Not authorized.', 403));
                return;
            }

            const { name, brand, category, description, price, sale, quantityInStock } = req.body;
            images = [];
            for (let i = 0; i < req.files.length; i++) {
                images.push(req.files[i].path.replace('src/frontend/', ''));
            }

            const newProduct = new Product({ name, brand, images, category, description, price, sale, quantityInStock });

            const product = await newProduct.save();
            res.json(successResponse(product));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {put} api/products/:id/restock Restock product
 * @apiName Restock a Product
 * @apiGroup Products
 * @apiPermission Admin
 * @apiUse AdminPermissionDescrp
 * 
 * @apiParam {String} id                    The id of the product.
 * @apiParam {Number} [quantity]            The quantity to restock the product, Quantity will be added to the quantity in the database
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:5000/api/products/5e540c7b75e3be0116153110/restock
 * 
 * @apiParamExample {json} Request-Example: 
 *      {
 *      	"quantity": 30
 *      }
 * @apiUse ProductSuccess
 * @apiUse NotAuthorizedError
 * @apiUse ValidationError
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
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
                res.status(403).json(errorResponse('Not authorized.', 403));
                return;
            }
            const product = await Product.findById(req.params.id);
            const quantity = req.body.quantity;
            product.quantityInStock += quantity;
            await product.save();
            res.json(successResponse(product));
            return;
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {put} api/products/:id/restock Review product
 * @apiName Review a Product
 * @apiGroup Products
 * @apiPermission User
 * 
 * @apiParam {String} id                  The id of the product.
 * @apiParam {String} text                The review text
 * @apiParam {String} rating              The rating of the product
 * @apiExample {curl} Example usage:
 *     curl -i http://localhost:5000/api/products/5e540c7b75e3be0116153110/review
 * 
 * @apiParamExample {json} Request-Example: 
 *      {
 *      	"text": "Wat een mooie schoen",
 *      	"rating": 5
 *      }
 * @apiUse ProductSuccess
 * @apiUse ValidationError
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.put('/:id/review', [
    auth, [
        check('text', 'You must write a message').not().isEmpty(),
        check('rating', 'Rating must be between 1 - 5').matches(/^[1-5]$/)
    ]
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(validationErrorResponse(errors.array(), 400));
        }
        try {
            const product = await Product.findById(req.params.id);
            if (!product) return res.status(400).json(errorResponse("Could not find product", 400));
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
            res.json(successResponse(product));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {delete} api/products/:id Delete product
 * @apiName DeleteProduct
 * @apiGroup Products
 * @apiUse AdminPermissionDescrp
 * @apiPermission Admin
 * 
 * @apiSuccess {Boolean}  success               if the request was a success
 * @apiSuccess {String}   msg                   The message of delete
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "msg": "Product deleted."
 *     }
 * 
 * @apiUse HeaderAuthToken
 * @apiUse NotAuthorizedError
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.delete('/:id', auth,
    async (req, res) => {
        try {
            // Check for ObjectId format
            if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
                const user = await User.findById(req.user.id).select('-password');
                if (user.role !== 'admin') {
                    return res.status(403).json(errorResponse('Not authorized.', 403));
                }
                const product = await Product.findById(req.params.id);
                if (product) {
                    await product.remove();
                    return res.json(messageResponse('Product removed', true));
                }
            }
            return res.status(404).json(errorResponse('product not found', 404));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

module.exports = router;