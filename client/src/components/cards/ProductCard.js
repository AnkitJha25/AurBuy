import React, { useState } from "react";
import {Card, Tooltip} from 'antd';
import {EyeOutlined, ShoppingCartOutlined} from '@ant-design/icons'
import loadingImg from "../../images/loadingImg.jpg"
import {Link} from 'react-router-dom';
import _ from 'lodash';
import {useSelector, useDispatch} from 'react-redux';

const {Meta} = Card;

const ProductCard = ({product}) => {
    const [tooltip, setTooltip] = useState('Click to Add');

    const {user, cart} = useSelector((state) => ({...state}));
    const dispatch = useDispatch();
    
    const handleAddToCart = () => {
        let cart = [];
        if(typeof window !== 'undefined'){
            if(localStorage.getItem('cart')){
                cart = JSON.parse(localStorage.getItem('cart'));
            }
            // push new prod to cart
            cart.push({
                ...product,
                count: 1,
            });
            // remove duplicates
            let unique = _.uniqWith(cart, _.isEqual);
            // save to local storage
            localStorage.setItem("cart", JSON.stringify(unique));
            // show tooltip
            setTooltip('Added');

            // add to redux state
            dispatch({
                type: 'ADD_TO_CART',
                payload: unique,
            });
            // cart item in side drawer
            dispatch({
                type: 'SET_VISIBLE',
                payload: true,
            });
        }
    };

    const {images, title, description, slug, price} = product;
    return (
        <Card 
            cover={<img src={images && images.length ? images[0].url : loadingImg} 
            style={{height: "150px", objectFit: "cover"}}
            className="p-1"
            />}
            actions={[
            <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br/> View Product
            </Link>, 
            <Tooltip title={tooltip}>
                <a onClick={handleAddToCart}><ShoppingCartOutlined className="text-danger"/> <br/> Add to cart </a>
            </Tooltip>
            ]}
        >
            <Meta title={`${title} - Rs. ${price}`} description={`${description && description.substring(0,40)}...`} />
        </Card>
    );
}

export default ProductCard;