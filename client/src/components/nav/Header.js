import React, { useState } from "react";
import { AppstoreOutlined, SettingOutlined, UserAddOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {Link} from "react-router-dom";
import firebase from "firebase/compat/app";
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate} from "react-router-dom";

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
                    <Item key="setting:1">Option 1</Item>
                    <Item key="setting:2">Option 2</Item>
                    <Item icon={<LogoutOutlined/>} onClick={logout}>
                        Logout
                    </Item>
                </SubMenu>)}

        </Menu>
    );
};

export default Header;