import React from "react";
import { Route, Link, Routes } from "react-router-dom";
import { useSelector } from "react-redux";

const UserRoute = ({children, ...rest}) => {
    const {user} = useSelector((state) => ({...state}));

    return user && user.token ? (
        <Route {...rest} element={() => children} />
    ) : (
        <h1 className="text-danger">Loading...</h1>
    );
}; 
export default UserRoute;