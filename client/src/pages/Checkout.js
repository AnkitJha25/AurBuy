import React, { useEffect, useState } from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { getUserCart, emptyUserCart, saveUserAddress, applyCoupon} from '../functions/user';
import {toast} from 'react-toastify';
import ReactQuill from 'react-quill';
import {useNavigate} from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';

const Checkout = () => {
    const [products, setProducts] = useState([]);
    const [total, setTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState("");

    const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
    const [discountError, setDiscountError] = useState("");

    const dispatch = useDispatch();
    const {user} = useSelector((state) => ({...state}));

    let navigate = useNavigate();

    useEffect(() => {
        getUserCart(user.token)
        .then(res => {
            console.log('user cart res', JSON.stringify(res.data, null, 4));
            setProducts(res.data.products);
            setTotal(res.data.cartTotal);
        });
    }, []);

    const emptyCart = () => {
        // remove from local storage
        if(typeof window !== 'undefined'){
            localStorage.removeItem('cart');
        }
        //remove from redux
        dispatch({
            type: 'ADD_TO_CART',
            payload: [],
        });
        // remove from backend
        emptyUserCart(user.token).then(res => {
            setProducts([]);
            setTotal(0);
            setTotalAfterDiscount(0);
            setCoupon("");
            toast.success('Cart is empty. Continue shopping.');
        });
    }

    const saveAddressToDb = () => {
        saveUserAddress(user.token, address)
        .then(res => {
            if(res.data.ok){
                setAddressSaved(true);
                toast.success('Address Saved');
            }
        })
    };

    const applyDiscountCoupon = () => {
        console.log('Send coupon to backend', coupon);
        applyCoupon(user.token, coupon)
        .then(res => {
            console.log('RES ON COUPON APPLIED', res.data);
            if(res.data){
                setTotalAfterDiscount(res.data);
                
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true,
                });
            }
            if(res.data.err){
                setDiscountError(res.data.err);
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false,
                });
            }
        });
    }

    const showAddress = () => (
        <>
            <ReactQuill theme='snow' value={address} onChange={setAddress} />
            <button className='btn btn-primary mt-2' onClick={saveAddressToDb}>
                Save
            </button>
        </>
    );

    const showProductsSummary = () => 
        products.map((p,i) => (
            <p>
                {p.product.title} ({p.color}) x {p.count} = {' '}
                {p.product.price * p.count}
            </p>
        ));

    const showApplyCoupon = () => (
        <>
            <input
                onChange={(e) => {
                    setCoupon(e.target.value);
                    setDiscountError("");
                }}
                value={coupon}
                type="text"
                className='form-control'
            />
            <button onClick={applyDiscountCoupon} className='btn btn-primary-mt-2'>
                Apply
            </button>
        </>
    );
    
    return (
        <div className='row'>
            <div className='col-md-6'>
                <h4>Delivery Address</h4>
                <br/>
                <br/>
                {showAddress()}
                <hr/>
                <h4>Got Coupon?</h4>
                <br/>
                {showApplyCoupon()}
                <br/>
                {discountError && <p className='bg-danger p-2'>{discountError}</p>}
            </div>

            <div className='col-md-6'>
                <h4>Order Summary</h4>
                <hr/>
                <p>Products {products.length}</p>
                <hr/>
                {showProductsSummary()}
                <hr/>
                <p>Cart Total: Rs. {total}</p>

                {totalAfterDiscount > 0 && (
                    <p className='bg-success p-2'>
                        Discount Applied: Total Payable: Rs. {totalAfterDiscount}
                    </p>
                )}

                <div className='row'>
                    <div className='col-md-6'>
                        <button 
                            className='btn btn-primary' 
                            disabled={!addressSaved || !products.length}
                            onClick={() => navigate('/payment')}
                        >
                            Place Order
                        </button>
                    </div>

                    <div className='col-md-6'>
                        <button 
                            className='btn btn-primary'
                            onClick={emptyCart}
                            disabled={!products.length}
                        >
                            Empty Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;