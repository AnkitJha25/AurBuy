import React, { useEffect, useState } from 'react';
import {getProductsByCount, fetchProductsByFilter} from '../functions/product';
import {useSelector, useDispatch} from 'react-redux';
import ProductCard from '../components/cards/ProductCard';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    let {search} = useSelector((state) => ({...state}));
    const {text} = search;

    useEffect(() => {
        loadAllProducts();
    }, [])

    const loadAllProducts = () => {
        getProductsByCount(12).then(p => {
            setProducts(p.data);
            setLoading(false);
        })
    };

    // load products on user search inputs (when the text from search changes, this use effect works)
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({query: text});
        }, 300);
        return () => clearTimeout(delayed);
    }, [text]);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg)
        .then(res => {
            setProducts(res.data);
        });
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3'>search/filter menu</div>

                <div className='col-md-9'>
                    {loading ? (
                        <h4 className='text-danger'>Loading...</h4>
                    ) : (
                        <h4 className='text-danger'>Products</h4>
                    )}

                    {products.length < 1 && <p>No products found</p>}

                    <div className='row'>
                        {products.map(p => (
                            <div key={p._id} className="col-md-4">
                                <ProductCard product={p} />
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Shop;