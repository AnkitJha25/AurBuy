const User = require('../models/user');
const Product = require('../models/product');
const Cart = require('../models/cart');
const Coupon = require('../models/coupon');

exports.userCart = async (req,res) => {
    const {cart} = req.body;

    let products = [];
    const user = await User.findOne({email: req.user.email}).exec();

    // check if the cart already exists
    let cartExistByThisUser = await Cart.findOne({orderedBy: user._id}).exec();

    if(cartExistByThisUser){
        await Cart.deleteOne({ orderedBy: user._id }).exec();
        //cartExistByThisUser.remove();
        console.log('removed old cart');
    }

    for(let i = 0 ; i < cart.length ; i++){
        let object = {};
        object.product = cart[i]._id;
        object.count = cart[i].count;
        object.color = cart[i].color;
        // get total price
        let productFromDb = await Product.findById(cart[i]._id).select('price').exec();
        object.price = productFromDb.price;

        products.push(object);
    }

    let cartTotal = 0;
    for(let i = 0 ; i < products.length ; i++){
        cartTotal += products[i].price * products[i].count;
    }

    let newCart = await new Cart({
        products,
        cartTotal,
        orderedBy: user._id,
    }).save();

    console.log('new cart --->', newCart);
    res.json({ok: true});
};

exports.getUserCart = async(req,res) => {
    const user = await User.findOne({email: req.user.email}).exec();

    let cart = await Cart.findOne({orderedBy: user._id})
    .populate('products.product', '_id title price totalAfterDiscount')
    .exec();

    const {products, cartTotal, totalAfterDiscount} = cart;
    res.json({products, cartTotal, totalAfterDiscount});
};

exports.emptyCart = async (req,res) => {
    const user = await User.findOne({email: req.user.email}).exec();

    const cart = await Cart.findOneAndRemove({orderedBy: user._id}).exec();
    res.json(cart);
};

exports.saveAddress = async (req,res) => {
    const userAddress = await User.findOneAndUpdate(
        {email: req.user.email},
        {address: req.body.address}
    ).exec();

    res.json({ok: true});
};

exports.applyCouponToUserCart = async (req,res) => {
    const {coupon} = req.body;
    console.log("COUPON", coupon);

    const validCoupon = await Coupon.findOne({name: coupon}).exec();
    if(validCoupon===null){
        return res.json({
            err: "Invalid Coupon",
        });
    }
    console.log("VALID COUPON", validCoupon);

    const user = await User.findOne({email: req.user.email}).exec();
    let {products, cartTotal} = await Cart.findOne({orderedBy: user._id})
    .populate("products.product","_id title price")
    .exec();

    console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

    let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount)/100).toFixed(2);

    Cart.findOneAndUpdate(
        {orderedBy: user._id},
        {totalAfterDiscount},
        {new: true}
    ).exec();
    res.json(totalAfterDiscount);
}