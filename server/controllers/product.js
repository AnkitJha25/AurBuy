const Product = require('../models/product');
const User = require("../models/user");
const slugify = require('slugify');

exports.create = async (req,res) => {
    try{
        console.log(req.body);
        req.body.slug = slugify(req.body.title);
        const newProduct = await new Product(req.body).save();
        res.json(newProduct);
    }catch(err){
        console.log(err);
        //res.status(400).send("Create product failed");
        res.status(400).json({
            err: err.message,
        });
    }
};

// Query the products that are saved in the database.
exports.listAll = async (req, res) => {
    let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate('category') // store just id and then use populate to fetch
    .populate('subs')     // the entire information corresponding to it.
    .sort([['createdAt','desc']])
    .exec();
    res.json(products);
};

exports.remove = async (req,res) => {
    try { 
        const deleted = await Product.findOneAndRemove({slug: req.params.slug}).exec();
        res.json(deleted);
    }
    catch(err){
        console.log(err);
        return res.status(400).send('Product delete failed');
    }
}

exports.read = async (req,res) => {
    const product = await Product.findOne({slug: req.params.slug})
    .populate('category')
    .populate('subs')
    .exec();
    res.json(product);
}

exports.update = async (req,res) => {
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updated = await Product.findOneAndUpdate({slug: req.params.slug}, req.body, {new: true}).exec();
        res.json(updated);
    }
    catch(err){
        console.log('PRODUCT UPDATE ERROR -->', err);
        // return res.status(400).send('Product update failed');
        res.status(400).json({
            err: err.message,
        });
    }
};

// Without using Pagination
// exports.list = async (req,res) => {
//     try{
//         const {sort, order, limit} = req.body;
//         const products = await Product.find({})
//         .populate('category')
//         .populate('subs')
//         .sort([[sort,order]])
//         .limit(limit)
//         .exec();

//         res.json(products);
//     }
//     catch(err){
//         console.log(err)
//     }
// };

// Using Pagination
exports.list = async (req,res) => {
    try {
        const {sort,order,page} = req.body;
        const currentPage = page || 1;
        const perPage = 3;

        const products = await Product.find({})
        .skip((currentPage-1)*perPage)
        .populate("category")
        .populate("subs")
        .sort([[sort,order]])
        .limit(perPage)
        .exec();

        res.json(products);
    }
    catch(err){
        console.log(err);
    }
}

exports.productsCount = async (req,res) => {
    let total = await Product.find({}).estimatedDocumentCount().exec();
    // .estimatedDocumentCount() is used to return total count of products in the db
    res.json(total);
}

// exports.productStar = async (req,res) => {
//     const product = await Product.findById(req.params.productId).exec();
//     const user = await User.findOne({email: req.user.email}).exec();
//     const {star} = req.body;

//     // check if user has already added a rating
//     let existingRatingObject = product.ratings.find(
//         (ele) => ele.postedBy.toString() === user._id.toString()
//     );

//     // if not, push the rating
//     if(existingRatingObject === undefined){
//         let ratingAdded = await Product.findByIdAndUpdate(
//             product._id,
//             {
//                 $push: {ratings: {star, postedBy: user._id}},
//             },
//             {new: true}
//         ).exec();
//         console.log('ratingAdded', ratingAdded);
//         res.json(ratingAdded);
//     }
//     else{
//         // added, update it
//         const ratingUpdated = await Product.updateOne(
//             {
//                 ratings: { $elemMatch: existingRatingObject },
//             },
//             { $set: {"ratings.$.star": star} },
//             {new: true}
//         ).exec();
//         console.log("ratingUpdated", ratingUpdated);
//         res.json(ratingUpdated);
//     }
// };

exports.listRelated = async (req, res) => {
    const product = await Product.findById(req.params.productId).exec();

    const related = await Product.find({
        _id: { $ne : product._id},
        category: product.category,
    })
    .limit(3)
    .populate('category')
    .populate('subs')
    //.populate('postedBy')
    .exec()

    res.json(related);
}

// Search filter
const handleQuery = async (req,res,query) => {
    const products = await Product.find({$text: {$search: query}})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec();

    res.json(products);
};

const handlePrice = async (req,res,price) => {
    try {
        let products = await Product.find({
            price: {
                $gte: price[0],
                $lte: price[1],
            },
        })
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

const handleCategory = async (req, res, category) => {
    try{
        let products = await Product.find({category})
        .populate('category', '_id name')
        .populate('subs', '_id name')
        .exec();

        res.json(products);
    }catch(err){
        console.log(err);
    }
};

const handleSub = async (req, res, sub) => {
    const products = await Product.find({subs: sub})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec();

    res.json(products);
}

const handleShipping = async (req, res, shipping) => {
    const products = await Product.find({shipping})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec();

    res.json(products);
}

const handleColor = async (req, res, color) => {
    const products = await Product.find({color})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec();

    res.json(products);
}

const handleBrand = async (req, res, brand) => {
    const products = await Product.find({brand})
    .populate('category', '_id name')
    .populate('subs', '_id name')
    .exec();

    res.json(products);
}

exports.searchFilters = async (req,res) => {
    const {query, price, category, sub, shipping, color, brand} = req.body;

    if(query){
        console.log("query", query);
        await handleQuery(req,res,query);
    }

    // price range array [l,r]
    if(price !== undefined){
        console.log('price--->', price);
        await handlePrice(req,res,price);
    }

    if(category) {
        console.log("Category-->", category);
        await handleCategory(req, res, category);
    }

    if(sub){
        console.log("Sub-->", sub);
        await handleSub(req, res, sub);
    }

    if(shipping){
        console.log("Shipping-->", shipping);
        await handleShipping(req, res, shipping);
    }

    if(color){
        console.log("Color-->", color);
        await handleColor(req, res, color);
    }

    if(brand){
        console.log("Brand-->", brand);
        await handleBrand(req, res, brand);
    }
};