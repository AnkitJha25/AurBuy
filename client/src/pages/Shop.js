import React, { useEffect, useState } from 'react';
import {getProductsByCount, fetchProductsByFilter} from '../functions/product';
import {getCategories} from '../functions/category';
import {useSelector, useDispatch} from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import {Menu, Slider, Checkbox} from 'antd';
import { DollarOutlined, DownSquareOutlined } from '@ant-design/icons';

const {SubMenu, ItemGroup} = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0,0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]); // to show category option in side bar
    const [categoryIds, setCategoryIds] = useState([]); 

    let dispatch = useDispatch();
    let {search} = useSelector((state) => ({...state}));
    const {text} = search;

    useEffect(() => {
        loadAllProducts();
        // fetch cat
        getCategories().then(res => setCategories(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg)
        .then(res => {
            setProducts(res.data);
        });
    };

    const loadAllProducts = () => {
        getProductsByCount(12).then(p => {
            setProducts(p.data);
            setLoading(false);
        });
    };

    // load products on user search inputs (when the text from search changes, this use effect works)
    useEffect(() => {
        const delayed = setTimeout(() => {
            fetchProducts({query: text});
        }, 300);
        return () => clearTimeout(delayed);
    }, [text]);

    // Load products based on price change
    useEffect(() => {
        console.log('ok to request');
        fetchProducts({price});
    }, [ok]);

    const handleSlider = (value) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setCategoryIds([]);
        setPrice(value);
        setTimeout(() => {
            setOk(!ok);
        }, 300);
    };

    // Load products bases on categories
    const showCategories = () => 
        categories.map(c => 
        (<div key={c._id}>
            <Checkbox 
                onChange={handleChange} 
                className='pb-2 pl-4 pr-4' 
                value={c._id} 
                name='category'
                checked={categoryIds.includes(c._id)}
            >
                {c.name}
            </Checkbox>
            <br/>
    </div>));

    const handleChange = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setPrice([0,0]);
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked) 
        // indexOf method ?? if not found returns -1 else returns index [1,2,3...]
        if(foundInTheState===-1){
            inTheState.push(justChecked);
        }else{
            // if found pull out one item from index
            inTheState.splice(foundInTheState, 1);
        }

        setCategoryIds(inTheState);
        //console.log(inTheState);
        fetchProducts({category: inTheState});

    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3 pt-2'>
                    <h4>Search Filter</h4>
                    <hr/>

                    <Menu defaultOpenKeys={["1","2"]} mode="inline">
                        {/*Price*/}
                        <SubMenu key="1" title={<span className='h6'><DollarOutlined /> Price</span>}>
                            <div>
                                <Slider 
                                    className='ml-4 mr-4' 
                                    tipFormatter={(v) => `Rs. ${v}`} 
                                    range 
                                    value={price} 
                                    onChange={handleSlider}
                                    max='200000'
                                />
                            </div>
                        </SubMenu>

                        {/*Category*/}
                        <SubMenu key="2" title={<span className='h6'><DownSquareOutlined /> Categories</span>}>
                            {showCategories()}
                        </SubMenu>
                    </Menu>
                </div>

                <div className='col-md-9 pt-2'>
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