import React, { useEffect, useState } from 'react';
import {getProductsByCount, fetchProductsByFilter} from '../functions/product';
import {getCategories} from '../functions/category';
import {getSubs} from '../functions/sub';
import {useSelector, useDispatch} from 'react-redux';
import ProductCard from '../components/cards/ProductCard';
import {Menu, Slider, Checkbox, Radio} from 'antd';
import { DollarOutlined, DownSquareOutlined } from '@ant-design/icons';

const {SubMenu, ItemGroup} = Menu;

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState([0,0]);
    const [ok, setOk] = useState(false);
    const [categories, setCategories] = useState([]); // to show category option in side bar
    const [categoryIds, setCategoryIds] = useState([]); 
    const [subs, setSubs] = useState([]);
    const [sub, setSub] = useState('');
    const [brands, setBrands] = useState(["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"]);
    const [brand, setBrand] = useState('');
    const [colors, setColors] = useState(["Black", "Brown", "Silver", "White", "Blue"]);
    const [color, setColor] = useState("");
    const [shipping, setShipping] = useState("");

    let dispatch = useDispatch();
    let {search} = useSelector((state) => ({...state}));
    const {text} = search;

    useEffect(() => {
        loadAllProducts();
        // fetch cat
        getCategories().then(res => setCategories(res.data));
        // fetch subs
        getSubs().then(res => setSubs(res.data));
    }, []);

    const fetchProducts = (arg) => {
        fetchProductsByFilter(arg)
        .then(res => {
            setProducts(res.data);
        });
    };

    // Load all products by default
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
        setSub('');
        setBrand("");
        setPrice(value);
        setColor("");
        setShipping("");
        setTimeout(() => {
            setOk(!ok);
        }, 300);
    };

    // Load products bases on categories
    const showCategories = () => 
        categories.map(c => 
        (<div key={c._id}>
            <Checkbox 
                onChange={handleCheck} 
                className='pb-2 pl-4 pr-4' 
                value={c._id} 
                name='category'
                checked={categoryIds.includes(c._id)}
            >
                {c.name}
            </Checkbox>
            <br/>
    </div>));

    const handleCheck = (e) => {
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setPrice([0,0]);
        setSub('');
        setBrand("");
        setColor("");
        setShipping("");
        let inTheState = [...categoryIds];
        let justChecked = e.target.value;
        let foundInTheState = inTheState.indexOf(justChecked);
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

    // show products by sub category
    const showSubs = () => subs.map((s) => (
        <div 
            key={s._id}
            onClick={() => handleSub(s)}
            className="p-1 m-1 badge badge-secondary"
            style={{cursor: "pointer"}}
        >
            {s.name}
        </div>));

    const handleSub = (sub) => {
        //console.log('SUB', sub);
        setSub(sub);
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setPrice([0,0]);
        setCategoryIds([]);
        setBrand("");
        setColor("");
        setShipping("");

        fetchProducts({sub});
    }

    // based on brand name
    const showBrands = () => brands.map((b) => (
        <Radio 
            value={b} 
            name={b} 
            checked={b===brand} 
            onChange={handleBrand}
            className="pb-1 pl-1 pr-4"    
        >
            {b}
        </Radio>));

    const handleBrand = (e) => {
        setSub('');
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setPrice([0,0]);
        setCategoryIds([]);
        setColor("");
        setBrand(e.target.value);
        setShipping("");
        fetchProducts({brand: e.target.value});
    };

    // based on colors
    const showColors = () => colors.map((c) => (
        <Radio
            value={c}
            name={c}
            checked={c===color}
            onChange={handleColor}
            className="pb-1 pl-4 pr-4"
        >
            {c}
        </Radio>
    ));

    const handleColor = (e) => {
        setSub("");
        dispatch({
            type: "SEARCH_QUERY",
            payload: {text: ""},
        });
        setPrice([0,0]);
        setCategoryIds([]);
        setBrand("");
        setColor(e.target.value);
        setShipping("");
        fetchProducts({color: e.target.value});
    }

    const showShipping = () => (
        <>
            <Checkbox
                className='pb-2 pl-4 pr-4'
                onChange={handleShippingChange}
                value="Yes"
                checked={shipping==='Yes'}
            >
                Yes
            </Checkbox>

            <Checkbox
                className='pb-2 pl-4 pr-4'
                onChange={handleShippingChange}
                value="No"
                checked={shipping==='No'}
            >
                No
            </Checkbox>
        </>
    );

    const handleShippingChange = (e) => {
        setSub('');
        dispatch({
            type: "SEARCH_QUERY",
            payload: { text: "" },
        });
        setPrice([0,0]);
        setCategoryIds([]);
        setBrand('');
        setColor('');
        setShipping(e.target.value);
        fetchProducts({shipping: e.target.value});
    };

    return (
        <div className='container-fluid'>
            <div className='row'>
                <div className='col-md-3 pt-2'>
                    <h4>Search Filter</h4>
                    <hr/>

                    <Menu defaultOpenKeys={["1","2","3","4","5","6"]} mode="inline">
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
                            <div style={{marginTop: "-10px" }}>{showCategories()}</div>
                        </SubMenu>

                        {/*Sub Category*/}
                        <SubMenu key="3" title={<span className='h6'><DownSquareOutlined /> Sub Categories</span>}>
                            <div style={{marginTop: '-10px'}} className="pl-4 pr-4">{showSubs()}</div>
                        </SubMenu>

                        {/*Brands*/}
                        <SubMenu key="4" title={<span className='h6'><DownSquareOutlined /> Brands</span>}>
                            <div style={{marginTop: '-10px'}} className="pr-5">{showBrands()}</div>
                        </SubMenu>

                        {/*Colors*/}
                        <SubMenu key="5" title={<span className='h6'><DownSquareOutlined /> Colors</span>}>
                            <div style={{marginTop: '-10px'}} className="pr-5">{showColors()}</div>
                        </SubMenu>

                        {/*Shipping*/}
                        <SubMenu key="6" title={<span className='h6'><DownSquareOutlined /> Shipping</span>}>
                            <div style={{marginTop: '-10px'}} className="pr-5">{showShipping()}</div>
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

                    <div className='row pb-5'>
                        {products.map(p => (
                            <div key={p._id} className="col-md-4 mt-3">
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