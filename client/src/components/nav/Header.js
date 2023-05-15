import React, { useState } from "react";
import { AppstoreOutlined, SettingOutlined, UserAddOutlined, UserOutlined, LogoutOutlined, ShoppingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {Link} from "react-router-dom";
import firebase from "firebase/compat/app";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";
import Search from '../forms/Search';
import Shop from "../../pages/Shop";

const {SubMenu, Item} = Menu;

const Header = () => {
    const[current, setCurrent] = useState('');

    let dispatch = useDispatch();
    let history = useNavigate();
    let {user} = useSelector((state) => ({...state}));

    const handleClick = (e) => {
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: "LOGOUT",
            payload: null,
        });
        history('/login');
    };

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined/>}>
                <Link to="/">Home</Link>
            </Item>

            <Item key="shop" icon={<ShoppingOutlined/>}>
                <Link to="/shop">Shop</Link>
            </Item>

            {!user && (
                <Item key="register" icon={<UserAddOutlined/>} className="judtify-content-end">
                    <Link to="/register">Register</Link>
                </Item>)}

            {!user && (
                <Item key="login" icon={<UserOutlined/>} className="justify-content-end">
                    <Link to="/login">Login</Link>
                </Item>)}

            {user && (
                <SubMenu icon={<SettingOutlined/>} title={user.email && user.email.split('@')[0]} className="float-right">
                    
                    {user.role==='subscriber' && (
                    <Item>
                        <Link to="/user/history">Dashboard</Link>
                    </Item>
                    )}

                    {user.role==='admin' && (
                    <Item>
                        <Link to="/admin/dashboard">Dashboard</Link>
                    </Item>
                    )}

                    <Item icon={<LogoutOutlined/>} onClick={logout}>
                        Logout
                    </Item>
                </SubMenu>)}

                <span className="float-right p-1">
                    <Search/>
                </span>
        </Menu>
    );
};

export default Header;