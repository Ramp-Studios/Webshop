//------------------
// Api Doc Defines
//------------------
//------------------
// Admin
//------------------
/**
 * @apiDefine AdminPermissionDescrp
 * @apiDescription This function should be only accesable by the admin 
 */

//------------------
// Header 
//------------------
/**
 * @apiDefine HeaderAuthToken
 * @apiHeader {String} x-auth-token Users unique access-token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *       "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"
 *     }
 */

//------------------
// Success Responses
//------------------
/**
 * @apiDefine UserCreateSuccess
 * @apiSuccess {Boolean}  success       if the request was a success
 * @apiSuccess {String}   token         A token that can be used in the x-auth-token header for authentication.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "success": true,
 *        "token": "<token>"
 *     }
 */

/**
 * @apiDefine ProfileSuccess
 * @apiSuccess {Boolean}  success               if the request was a success
 * @apiSuccess {Object}   address               The address object
 * @apiSuccess {String}   address.street        Street    
 * @apiSuccess {Number}   address.houseNumber   House number
 * @apiSuccess {String}   address.zipcode       Zipcode
 * @apiSuccess {String}   _id                   Id of the profile
 * @apiSuccess {String}   user                  User id
 * @apiSuccess {Date}     date                  Date of the entry
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "address": {
 *         "street": "Tinwerf",
 *         "houseNumber": "16",
 *         "zipcode": "2544ED",
 *         "city": "Den Haag"
 *       },
 *       "_id": "5e543a2b46141c40cbaf13c9",
 *       "user": "5e4e6d499052c800430130b8",
 *       "__v": 0,
 *       "date": "2020-02-24T21:03:39.384Z"
 *     }
 */

 /**
 * @apiDefine ProductsSuccess
 * @apiSuccess {Boolean}    success               if the request was a success
 * @apiSuccess {Object[]}   products              The List with product objects
 * @apiSuccess {Number}     totalPages            Total amount of pages there are with products
 * @apiSuccess {Number}     limit                 Limit otal amount of products in the products array 
 * @apiSuccess {Number}     pageNo                Page Number on which page to show
 * @apiSuccess {Number}     totalProducts         The total of products in the database
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "products": [
 *         {
 *           "images": [],
 *           "sale": 1,
 *           "_id": "5e540c5f75e3be011615310f",
 *           "name": "Nike Shoe",
 *           "brand": "Nike",
 *           "category": "Shoes",
 *           "description": "A Shoe with the brand Nike",
 *           "price": 12,
 *           "quantityInStock": 21,
 *           "reviews": [
 *             {
 *               "date": "2020-02-24T20:16:42.475Z",
 *               "_id": "5e542f2a01a7480505272996",
 *               "user": "5e4e6d499052c800430130b8",
 *               "text": "Wat een mooie schoen",
 *               "rating": 5,
 *               "name": "admin",
 *               "avatar": "//www.gravatar.com/avatar/75d23af433e0cea4c0e45a56dba18b30?s=200&r=pg&d=mm"
 *             },
 *             {
 *               "date": "2020-02-24T17:52:25.260Z",
 *               "_id": "5e540d5975e3be0116153111",
 *               "user": "5e4e6d499052c800430130b8",
 *               "text": "Wat een slechte schoen",
 *               "rating": 1,
 *               "name": "admin",
 *               "avatar": "//www.gravatar.com/avatar/75d23af433e0cea4c0e45a56dba18b30?s=200&r=pg&d=mm"
 *             }
 *           ],
 *           "date": "2020-02-24T17:48:15.863Z",
 *           "__v": 2
 *         },
 *         {
 *           "images": [],
 *           "sale": 1,
 *           "_id": "5e540c7b75e3be0116153110",
 *           "name": "Nike AirMax",
 *           "brand": "Nike",
 *           "category": "Shoes",
 *           "description": "A Shoe with the brand Nike",
 *           "price": 12,
 *           "quantityInStock": 81,
 *           "reviews": [],
 *           "date": "2020-02-24T17:48:43.233Z",
 *           "__v": 0
 *         }
 *       ],
 *       "totalPages": 1,
 *       "limit": 10,
 *       "pageNo": 1,
 *       "totalProducts": 2
 *     }
 */

/**
 * @apiDefine ProductSuccess
 * @apiSuccess {Boolean}    success             if the request was a success
 * @apiSuccess {String[]}   images              The List with product images
 * @apiSuccess {Number={0..1}}     sale         A number representing the sale 0.5 is 50% sale, 0.9 is 10% sale, 1 is no sale
 * @apiSuccess {String}     _id                 The id of the product 
 * @apiSuccess {String}     name                Name of the product
 * @apiSuccess {String}     brand               Brand of the product
 * @apiSuccess {String}     category            Category of the product
 * @apiSuccess {String}     description         The description of the product
 * @apiSuccess {Number}     price               The price of the product without sale applied
 * @apiSuccess {Number}     quantityInStock     Quantity of the products in stock
 * @apiSuccess {Object[]}   review              List of reviews from users
 * @apiSuccess {String}     review._id          The id of the review
 * @apiSuccess {String}     review.user         The id of the user
 * @apiSuccess {String}     review.text         The text that the reviewer wrote
 * @apiSuccess {String}     review.rating       The rating the reviewer gave
 * @apiSuccess {String}     review.name         The name of the reviewer
 * @apiSuccess {String}     review.avatar       The avatar of the reviewer
 * @apiSuccess {String}     review.date         The date when the review was written 
 * @apiSuccess {Date}       date                The date of when the product was added
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *          "success": true,
 *          "images": ["img/231_image_nike_shoe_front.jpeg", "img/231_image_nike_shoe_back.jpeg"],
 *          "sale": 1,
 *          "_id": "5e540c7b75e3be0116153110",
 *          "name": "Nike AirMax",
 *          "brand": "Nike",
 *          "category": "Shoes",
 *          "description": "A Shoe with the brand Nike",
 *          "price": 12,
 *          "quantityInStock": 81,
 *          "reviews": [
 *              {
 *                "_id": "5e54d8a63d3f4822741aa596",
 *                "user": "5e540b5c75e3be011615310e",
 *                "text": "Wat een mooie schoen",
 *                "rating": 5,
 *                "name": "roy",
 *                "avatar": "//www.gravatar.com/avatar/1981936514e4e4ed96a75063ce53f4c8?s=200&r=pg&d=mm",
 *                "date": "2020-02-25T08:19:50.229Z"
 *              }
 *          ],
 *          "date": "2020-02-24T17:48:43.233Z",
 *          "__v": 0
 *    }
 */


 /**
 * @apiDefine CartSuccessResponse
 * @apiSuccess {Boolean}  success       if the request was a success
 * @apiSuccess {String}   _id           Id of the productlist cart
 * @apiSuccess {Object[]} products      Array with the products
 * @apiSuccess {Number} priceTotal      The total price of all the products in the list
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "success": true,
 *       "_id": "5e540e2075e3be0116153112",
 *       "name": "cart",
 *       "products": [
 *         {
 *           "amount": 2,
 *           "_id": "5e540c7b75e3be0116153110",
 *           "name": "Nike AirMax",
 *           "brand": "Nike",
 *           "image": "",
 *           "description": "A Shoe with the brand Nike",
 *           "price": 12,
 *           "priceTotal": 24,
 *           "quantityInStock": 81
 *         },
 *         {
 *           "amount": 2,
 *           "_id": "5e540c5f75e3be011615310f",
 *           "name": "Nike Shoe",
 *           "brand": "Nike",
 *           "image": "",
 *           "description": "A Shoe with the brand Nike",
 *           "price": 12,
 *           "priceTotal": 24,
 *           "quantityInStock": 21
 *         }
 *       ],
 *       "priceTotal": 48
 *     }
 */

//------------------
// Error Responses
//------------------
/**
 * @apiDefine NotAuthorizedError
 * @apiError NotAuthorizedError  Only a user with the role Admin can access this route. 
 * @apiErrorExample {json} Not Authorized
 *     HTTP/1.1 403 Forbidden
 *     {
 *       "success": false,
 *       "error": "Something went wrong.",
 *       "statusCode": 403,
 *       "msg": "Not authorized."
 *     }
 */ 

/**
 * @apiDefine NoProfileFoundError
 * @apiError NoProfileFoundError  There is no profile found for the user. 
 * @apiErrorExample {json} No Profile Found Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "success": false,
 *       "msg": "There is no profile for this user."
 *     }
 */ 

/**
 * @apiDefine ServerError
 * @apiError ServerError        Could not retrieve information for the database
 * @apiErrorExample {json} Server Error Response
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *          "success": false,
 *          "error": "Something went wrong.",
 *          "statusCode": 500,
 *          "msg": "Server error"
 *     }
 */

/**
 * @apiDefine ValidationError
 * @apiError ValidationError    One of the mandantory params are missing.
 * @apiErrorExample {json} Validation Error Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "success": false,
 *       "error": "Validation Error.",
 *       "statusCode": 400,
 *       "errors": [
 *         {
 *           "msg": "E-mail is required",
 *           "param": "email",
 *           "location": "body"
 *         }
 *       ]
 *     }
 */

/**
 * @apiDefine UserExistsError
 * @apiError UserAlreadyExists  The used e-mail already exists. 
 * @apiErrorExample {json} User Exists Error
 *     HTTP/1.1 400 Bad Request
 *     {
 *          "success": false,
 *          "error": "Something went wrong.",
 *          "statusCode": 400,
 *          "msg": "User already exists."
 *     }
 */

/**
 * @apiDefine InvalidCredentialsError
 * @apiError InvalidCredentials  E-mail or Password is wrong. 
 * @apiErrorExample {json} Invalid Credentials Error Response
 *     HTTP/1.1 400 Bad Request
 *     {
 *          "success": false,
 *          "error": "Something went wrong.",
 *          "statusCode": 400,
 *          "msg": "Invalid Credentials."
 *     }
 */

 /**
 * @apiDefine NoProductFoundError
 * @apiError NoProductFoundError  There is no product found with that id. 
 * @apiErrorExample {json} No Product Found Response
 *     HTTP/1.1 404 Not Found
 *     {
 *          "success": false,
 *          "error": "Something went wrong.",
 *          "statusCode": 404,
 *          "msg": "Product not found."
 *     }
 */ 

/**
 * @apiDefine NoTokenError
 * @apiError NoTokenError  No token or invalid token, authorization denied 
 * @apiErrorExample {json} No Token Error Response
 *     HTTP/1.1 401 Unauthorized
 *     {
 *          "success": false,
 *          "error": "Something went wrong.",
 *          "statusCode": 401,
 *          "msg": "No token or invalid token, authorization denied"
 *     }
 */ 
