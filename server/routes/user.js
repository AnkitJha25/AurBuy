const express = require('express');

const router = express.Router();

//middleware
const {authCheck} = require('../middlewares/auth');
//contoller
const {userCart, getUserCart, emptyCart, saveAddress} = require('../controllers/user');

router.post('/user/cart', authCheck, userCart); //save cart
router.get('/user/cart', authCheck, getUserCart); //get cart
router.delete('/user/cart', authCheck, emptyCart); //empty cart
router.post('/user/address', authCheck, saveAddress);

// router.get('/user', (req, res) => {
//     res.json({
//         data : 'hey you hit user endpoint',
//     });
// });

module.exports = router;