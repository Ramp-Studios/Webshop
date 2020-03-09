const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { ObjectID } = require('mongodb');
const {serverErrorResponse, messageResponse, successResponse, errorResponse, validationErrorResponse} = require('../../util/responses');


// Models
const Product = require('../../models/Product');
const User = require('../../models/User');
const ProductList = require('../../models/ProductList');

// post productlists/cart/buy

/**
 * @api {get} api/productlists/cart Get Cart
 * @apiName GetCart
 * @apiGroup Productlists
 * @apiPermission User
 * 
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse CartSuccessResponse
 * @apiUse ServerError
 */
router.get('/cart', auth,
    async (req, res) => {
        try {
            const productList = await ProductList
                .findOne({ user: req.user.id, name: 'cart' });

            let result = await generateCart(productList);
            return res.json(successResponse(result));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {get} api/productlists/carts Get all carts
 * @apiUse AdminPermissionDescrp
 * @apiPermission Admin
 * @apiName GetCarts
 * @apiGroup Productlists
 * 
 * @apiSuccess {Boolean}  success               if the request was a success
 * @apiSuccess {String}   number                Index of a productlist
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "0": {
 *         "name": "cart",
 *         "_id": "5e540e2075e3be0116153112",
 *         "user": "5e4e6d499052c800430130b8",
 *         "products": [
 *           {
 *             "amount": 4,
 *             "_id": "5e547e7497e2370ecab889e1",
 *             "product": "5e540c5f75e3be011615310f"
 *           },
 *           {
 *             "amount": 3,
 *             "_id": "5e540e2075e3be0116153113",
 *             "product": "5e540c7b75e3be0116153110"
 *           }
 *         ],
 *         "date": "2020-02-24T17:55:44.927Z",
 *         "__v": 1
 *       },
 *       "1": {
 *         "name": "cart",
 *         "_id": "5e5492975dc5731b2e8e6e8e",
 *         "user": "5e540b5c75e3be011615310e",
 *         "products": [
 *           {
 *             "amount": 1,
 *             "_id": "5e5492975dc5731b2e8e6e8f",
 *             "product": "5e540c7b75e3be0116153110"
 *           }
 *         ],
 *         "date": "2020-02-25T03:20:55.737Z",
 *         "__v": 0
 *       },
 *       "success": true
 *     }
 * 
 * @apiUse HeaderAuthToken
 * @apiUse NotAuthorizedError
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.get('/carts', auth,
    async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (user.role !== 'admin') {
                return res.status(403).json(errorResponse('Not authorized.', 403));
            }
            const productList = await ProductList.find();
            res.json(successResponse(productList));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {put} api/productslists/cart/product/:productId Add Product to Cart
 * @apiName UpdateCart
 * @apiGroup Productlists
 * @apiPermission User
 * 
 * @apiParam {String} productId    Mandatory product id.
 * @apiParam {Number} [amount=1]   Optional amount of products to add to the cart.
 * @apiParamExample {json} Request-Example: 
 *      {
 *          "amount": 2
 *      }
 * 
 * @apiUse CartSuccessResponse
 * @apiUse NoProductFoundError
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.put('/cart/product/:productId', auth,
    async (req, res) => {
        try {
            let productList = await ProductList
                .findOne({ user: req.user.id, name: 'cart' });

            if (productList === null) {
                productList = new ProductList({
                    user: req.user.id,
                    name: "cart",
                    products: []
                })
            }

            // Check for ObjectId format
            if (req.params.productId.match(/^[0-9a-fA-F]{24}$/)) {
                const product = await Product.findById(req.params.productId);
                const amount = parseInt(req.body.amount) ? parseInt(req.body.amount) : 1;
                if (product) {
                    let updated = false;
                    productList.products.map((item) => {
                        if (item.product.equals(req.params.productId)) {
                            item.amount += amount;
                            updated = true;
                        }
                        return item;
                    });
                    if (updated === false) {
                        const cartProduct = {
                            product: req.params.productId,
                            amount: amount
                        }
                        productList.products.unshift(cartProduct);
                    }

                    await productList.save();
                    let result = await generateCart(productList); 
                    return res.json(successResponse(result));
                }
            }
            res.status(404).json(errorResponse('Product not found.', 404));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

/**
 * @api {delete} api/productlists/cart Delete Cart
 * @apiName DeleteCart
 * @apiGroup Productlists
 * @apiPermission User
 * 
 * @apiSuccess {Boolean}  success               if the request was a success
 * @apiSuccess {String}   msg                   The message of delete
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "msg": "Successfully deleted cart."
 *     }
 * 
 * @apiUse HeaderAuthToken
 * @apiUse NoTokenError
 * @apiUse ServerError
 */
router.delete('/cart', auth,
    async (req, res) => {
        try {
            await ProductList.findOneAndDelete({ user: req.user.id, name: 'cart' });
            res.json(messageResponse("Successfully deleted cart.", true));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);


// @route    PUT api/productslists/cart/buy
// @desc     Buy a product
// @access   Private
router.put('/cart/buy', auth,
    async (req, res) => {
        try {
            const product = await Product.findById(req.params.id);
            const quantity = req.body.quantity === undefined ? 1 : req.body.quantity;
            if (product.quantityInStock >= quantity) {
                product.quantityInStock -= quantity;
                await product.save();
                res.json(messageResponse("Bought product.", true));
                return;
            }
            res.status(409).json(errorResponse(`Out of stock there are only ${product.quantityInStock} left.`, 409));
        }
        catch (err) {
            console.error(err.message);
            res.status(500).json(serverErrorResponse);
        }
    }
);

//---------------------------------------
// Util function for generating the cart
//---------------------------------------
const generateCart = async (productList) => {
    let productIds = [];
    let result = {
        _id: productList._id,
        name: productList.name,
        products: [],
        priceTotal: 0
    }
    if (!productList) return result;

    try {

        productList.products.map(cartObject => {
            productIds.unshift(ObjectID(cartObject.product));
            return cartObject;
        });
        
        const productsInCart = await Product.find({ _id: { $in: productIds } });
        const products = productList.products;
    
        for (let i = 0; i < products.length; i++) {
            for (let j = 0; j < productsInCart.length; j++) {
                let productIdList = products[i].product;
                let productId = productsInCart[j]._id;
                if (productId.equals(productIdList)) {
                    priceTotalItem = products[i].amount * productsInCart[j].price;
                    result.products.unshift({
                        amount: products[i].amount,
                        _id: productsInCart[j]._id,
                        name: productsInCart[j].name,
                        brand: productsInCart[j].brand,
                        image: productsInCart[j].images[0] !== undefined ? productsInCart[j].images[0] : "",
                        description: productsInCart[j].description,
                        price: productsInCart[j].price,
                        priceTotal: priceTotalItem,
                        quantityInStock: productsInCart[j].quantityInStock,
                    });
                    result.priceTotal += priceTotalItem;
                }
            }
        }
        return result;
    }
    catch(error) {
        throw error;
    }
}

module.exports = router;