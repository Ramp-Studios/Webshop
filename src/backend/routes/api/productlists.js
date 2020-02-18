const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { MongoClient, ObjectID } = require('mongodb');
const { check, validationResult } = require('express-validator');

// Models
const Product = require('../../models/Product');
const User = require('../../models/User');
const ProductList = require('../../models/ProductList');

// post productlists/cart/buy

// @route    GET api/productlists/cart
// @desc     Get all products in the productlist
// @access   Private
router.get('/cart', auth,
    async (req, res) => {
        try {
            const productList = await ProductList
                .findOne({ user: req.user.id, name: 'cart' });

            if (!productList) res.json("You don't have anything in your cart yet");
            let productIds = [];
            productList.products.map(cartObject => {
                productIds.unshift(ObjectID(cartObject.product));
                return cartObject;
            });

            result = {
                _id: productList._id,
                name: productList.name,
                products: [],
                priceTotal: 0
            }

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
            res.json(result);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    GET api/productlists/cart
// @desc     Get all products in the productlist
// @access   Private
router.get('/carts', auth,
    async (req, res) => {
        try {
            const productList = await ProductList.find();
            res.json(productList);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

// @route    PUT api/productslists/cart/product/:productId
// @desc     Add a product to cart
// @access   Private
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
                res.json(productList.products);
            }
            res.status(404).send('Product not found');
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


// @route    DELETE api/productlists/cart
// @desc     Removes and empties cart
// @access   Private
router.delete('/cart', auth,
    async (req, res) => {
        try {
            const productList = await ProductList
                .findOneAndDelete({ user: req.user.id, name: 'cart' });


            res.json("Successfully deleted cart");
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
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
                res.json("Bought product");
                return;
            }
            res.json(`Out of stock there are only ${product.quantityInStock} left`);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);

module.exports = router;