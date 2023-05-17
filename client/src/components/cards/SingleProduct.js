import React, { useState } from "react";
import {Card, Tabs, Tooltip} from 'antd';
import {Link} from 'react-router-dom';
import {HeartOutlined, ShoppingCartOutlined} from '@ant-design/icons'
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import loadingImg from '../../images/loadingImg.jpg';
import ProductListItems from "./ProductListItems";
import StarRating from 'react-star-ratings';
import RatingModal from '../modal/RatingModal';
import _ from 'lodash';
import {useSelector, useDispatch} from 'react-redux';

const {TabPane} = Tabs;

const SingleProduct = ({product}) => {
    const {title, images, description, _id} = product;
    const [tooltip, setTooltip] = useState("Click to Add");

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
            })
        }
    }

    return (
        <>
            <div className="col-md-7">
                {images && images.length ? 
                    (<Carousel showArrows={true} autoPlay infiniteLoop>
                        {images && images.map((i) => <img src={i.url} key={i.public_id}/>)}
                    </Carousel>) : (
                        <Card cover={<img src={loadingImg} className="mb-3 card-img"/>}></Card>
                    ) 
                }

                <Tabs type='card'>
                    <TabPane tab="Description" key="1">
                        {description && description}
                    </TabPane>
                    <TabPane tab="More" key="2">
                        Call us on 12345 67890 to learn more about this product.
                    </TabPane>
                </Tabs>
            </div>

            <div className="col-md-5">
                <h1 className="bg-info p-3">{title}</h1>

                <Card
                    actions={[
                        <Tooltip title={tooltip}>
                            <a onClick={handleAddToCart}><ShoppingCartOutlined className="text-danger"/> <br/> Add to cart </a>
                        </Tooltip>,
                        <Link to ="/">
                            <HeartOutlined className="text-info"/>
                            <br/>
                            Add to Wishlist
                        </Link>,
                        <RatingModal>
                            <StarRating
                                name={_id}
                                numberOfstars={5} 
                                rating={2}
                                changeRating={(newRating, name) => console.log('newRating', newRating, 'name', name)}
                                isSelectable={true}
                                starRatedColor='red'
                            />
                        </RatingModal>
                    ]}
                >
                <ProductListItems product={product}/>
                </Card>
            </div>
        </>
    )
}

export default SingleProduct;