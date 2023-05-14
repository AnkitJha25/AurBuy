import React, {useState, useEffect} from 'react';
import {getProduct} from '../functions/product';
import {useParams} from 'react-router-dom';
import SingleProduct from '../components/cards/SingleProduct';
import { getRelated } from '../functions/product';
import ProductCard from '../components/cards/ProductCard';

const Product = () => {
    const [product, setProduct] = useState({});
    const [related, setRelated] = useState([]);
    
    let params = useParams();

    useEffect(() => {
        loadSingleProducts();
    }, [params.slug]);

    const loadSingleProducts = () => {
        getProduct(params.slug).then((res) => {
            setProduct(res.data);

            // related 
            getRelated(res.data._id).then(res => setRelated(res.data));
        });
    }

    return (
        <div className='container-fluid'>
            <div className='row pt-4'>
                <SingleProduct product={product} />
            </div>    

            <div className='row'>
                <div className='col text-center pt-5 pb-5'>
                    <hr/>
                    <h4>Related Products</h4>
                    <hr/>
                </div>
            </div>
            <div className='row pb-5'>
                {related.length ? (
                    related.map((r) => (
                        <div key={r._id} className="col-md-4">
                            <ProductCard product={r} />
                        </div>
                    ))
                ) : <div className='text-center col'>No Products Found</div>}
            </div>
        </div>
    )
}

export default Product;